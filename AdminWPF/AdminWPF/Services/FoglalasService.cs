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

        /// <summary>
        /// Létrehozza a foglalást, majd a foglalasiAdatokat is (két API hívás).
        /// Visszaad egy hibaüzenetet ha sikertelen, null ha sikeres.
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
                    // BadRequestError esetén a backend JSON üzenetet ad vissza
                    try
                    {
                        var errObj = JsonSerializer.Deserialize<ApiHibaValasz>(hiba);
                        return errObj?.message ?? $"Foglalás sikertelen ({foglalasResponse.StatusCode})";
                    }
                    catch
                    {
                        return $"Foglalás sikertelen ({foglalasResponse.StatusCode})";
                    }
                }

                // 2. Az új foglalás id-jának kiolvasása
                var ujFoglalas = await foglalasResponse.Content.ReadFromJsonAsync<Foglalas>();
                if (ujFoglalas == null) return "Foglalás létrejött, de az id nem olvasható";

                // 3. FoglalasiAdatok létrehozása
                adatok.FoglalaId       = ujFoglalas.Id;
                adatok.FoglaiasDatum   = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                var adatokResponse = await _httpClient.PostAsJsonAsync("/api/foglalasiAdatok", adatok);

                if (!adatokResponse.IsSuccessStatusCode)
                {
                    // A foglalás megvan, de az adatok mentése sikertelen – töröljük vissza
                    await _httpClient.DeleteAsync($"/api/foglalasok/{ujFoglalas.Id}");
                    string hiba = await adatokResponse.Content.ReadAsStringAsync();
                    try
                    {
                        var errObj = JsonSerializer.Deserialize<ApiHibaValasz>(hiba);
                        return errObj?.message ?? $"Foglalási adatok mentése sikertelen ({adatokResponse.StatusCode})";
                    }
                    catch
                    {
                        return $"Foglalási adatok mentése sikertelen ({adatokResponse.StatusCode})";
                    }
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
        /// Törli a foglalást. A backend kaszkád törli a foglalasiAdatokat is.
        /// </summary>
        public async Task<string?> DeleteFoglalasAsync(int foglalasId)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"/api/foglalasok/{foglalasId}");
                if (response.IsSuccessStatusCode) return null;

                string hiba = await response.Content.ReadAsStringAsync();
                try
                {
                    var errObj = JsonSerializer.Deserialize<ApiHibaValasz>(hiba);
                    return errObj?.message ?? $"Törlés sikertelen ({response.StatusCode})";
                }
                catch
                {
                    return $"Törlés sikertelen ({response.StatusCode})";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás törlésekor: {ex.Message}");
                return $"Kivétel: {ex.Message}";
            }
        }
    }

    // API hibaválasz deszializáláshoz
    internal class ApiHibaValasz
    {
        [JsonPropertyName("message")]
        public string? message { get; set; }

        [JsonPropertyName("error")]
        public string? error { get; set; }
    }
}
