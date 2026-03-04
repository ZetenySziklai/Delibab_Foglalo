using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AdminWPF.Models;

namespace AdminWPF.Services
{
    public class FoglalasService
    {
        private readonly HttpClient _httpClient;

        public FoglalasService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Foglalas>> GetFoglalasokAsync()
        {
            try
            {
                var result = await _httpClient.GetFromJsonAsync<List<Foglalas>>("/api/foglalasok");
                return result ?? new List<Foglalas>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalások lekérésekor: {ex.Message}");
                return new List<Foglalas>();
            }
        }

        // Lekéri a foglalasiadatok tábla összes sorát (id + FoglalasId kell)
        public async Task<List<FoglalasiAdatokValasz>> GetFoglalasiAdatokAsync()
        {
            try
            {
                var result = await _httpClient.GetFromJsonAsync<List<FoglalasiAdatokValasz>>("/api/foglalasi-adatok");
                return result ?? new List<FoglalasiAdatokValasz>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalási adatok lekérésekor: {ex.Message}");
                return new List<FoglalasiAdatokValasz>();
            }
        }

        /// <summary>
        /// 1. POST /api/foglalasok  → kapja vissza az új foglalas.id-t
        /// 2. POST /api/foglalasi-adatok  → FoglalaId = foglalas.id
        /// </summary>
        public async Task<string?> CreateFoglalasAsync(FoglalasLetrehozas foglalas, FoglalasiadatokLetrehozas adatok)
        {
            try
            {
                // 1. Foglalás létrehozása
                var foglalasResponse = await _httpClient.PostAsJsonAsync("/api/foglalasok", foglalas);

                if (!foglalasResponse.IsSuccessStatusCode)
                {
                    string hiba = await foglalasResponse.Content.ReadAsStringAsync();
                    var errObj = JsonSerializer.Deserialize<ApiHibaValasz>(hiba);
                    return errObj?.HibaSzoveg ?? $"Foglalás sikertelen ({foglalasResponse.StatusCode})";
                }

                // 2. Visszakapott foglalas.id kiolvasása
                var ujFoglalas = await foglalasResponse.Content.ReadFromJsonAsync<Foglalas>();
                if (ujFoglalas == null) return "Foglalás létrejött, de az id nem olvasható";

                // 3. FoglalasiadatokLetrehozas: FoglalaId = az új foglalas.id
                adatok.FoglalaId     = ujFoglalas.Id;
                adatok.FoglaiasDatum = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd HH:mm:ss");

                var adatokResponse = await _httpClient.PostAsJsonAsync("/api/foglalasi-adatok", adatok);

                if (!adatokResponse.IsSuccessStatusCode)
                {
                    // Rollback: foglalást töröljük vissza
                    await _httpClient.DeleteAsync($"/api/foglalasok/{ujFoglalas.Id}");
                    string hiba = await adatokResponse.Content.ReadAsStringAsync();
                    var errObj = JsonSerializer.Deserialize<ApiHibaValasz>(hiba);
                    return errObj?.HibaSzoveg ?? $"Foglalási adatok mentése sikertelen ({adatokResponse.StatusCode})";
                }

                return null; // siker
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás létrehozásakor: {ex.Message}");
                return $"Kivétel: {ex.Message}";
            }
        }

        /// <summary>
        /// Törlés: előbb a foglalasiadatok sort, majd a foglalást.
        /// Ha foglalasiAdatokId null, csak a foglalást törli.
        /// </summary>
        public async Task<string?> DeleteFoglalasAsync(int foglalasId, int? foglalasiAdatokId = null)
        {
            try
            {
                // 1. Foglalasiadatok törlése (ha van)
                if (foglalasiAdatokId.HasValue)
                {
                    var adatokResp = await _httpClient.DeleteAsync($"/api/foglalasi-adatok/{foglalasiAdatokId.Value}");
                    // Ha 404 → már nincs, folytatjuk
                    if (!adatokResp.IsSuccessStatusCode && adatokResp.StatusCode != System.Net.HttpStatusCode.NotFound)
                    {
                        string hiba = await adatokResp.Content.ReadAsStringAsync();
                        var errObj = JsonSerializer.Deserialize<ApiHibaValasz>(hiba);
                        return errObj?.HibaSzoveg ?? $"Foglalási adatok törlése sikertelen ({adatokResp.StatusCode})";
                    }
                }

                // 2. Foglalás törlése
                var response = await _httpClient.DeleteAsync($"/api/foglalasok/{foglalasId}");
                if (response.IsSuccessStatusCode) return null;

                string hibaFogl = await response.Content.ReadAsStringAsync();
                var errFogl = JsonSerializer.Deserialize<ApiHibaValasz>(hibaFogl);
                return errFogl?.HibaSzoveg ?? $"Törlés sikertelen ({response.StatusCode})";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás törlésekor: {ex.Message}");
                return $"Kivétel: {ex.Message}";
            }
        }
    }

    internal class ApiHibaValasz
    {
        [JsonPropertyName("message")]
        public string? message { get; set; }

        [JsonPropertyName("msg")]
        public string? msg { get; set; }

        [JsonPropertyName("error")]
        public string? error { get; set; }

        public string? HibaSzoveg => message ?? msg ?? error;
    }

    // A GET /api/foglalasi-adatok válasz modellje
    public class FoglalasiAdatokValasz
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("felnott")]
        public int Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int Gyerek { get; set; }

        [JsonPropertyName("megjegyzes")]
        public string? Megjegyzes { get; set; }

        // Sequelize által generált FK – a DB-ben FoglalaId oszlopnév
        [JsonPropertyName("FoglalaId")]
        public int FoglalasId { get; set; }
    }
}
