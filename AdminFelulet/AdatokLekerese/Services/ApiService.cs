using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AdatokElerese.Models;

namespace AdatokElerese.Services
{
    /// <summary>
    /// HTTP kliens szolgáltatás a Backend API-val való kommunikációhoz
    /// </summary>
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        /// <summary>
        /// Konstruktor - alapértelmezett URL: http://localhost:8000/api/
        /// </summary>
        public ApiService(string baseUrl = "http://localhost:8000/api/")
        {
            _baseUrl = baseUrl;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(_baseUrl);
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        #region Asztal műveletek

        /// <summary>
        /// Összes asztal lekérése
        /// </summary>
        public async Task<List<AsztalDto>> GetAsztalokAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("asztalok");
                response.EnsureSuccessStatusCode();
                var asztalok = await response.Content.ReadFromJsonAsync<List<AsztalDto>>();
                return asztalok ?? new List<AsztalDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztalok lekérésekor: {ex.Message}");
                return new List<AsztalDto>();
            }
        }

        /// <summary>
        /// Egy asztal lekérése ID alapján
        /// </summary>
        public async Task<AsztalDto> GetAsztalByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"asztalok/{id}");
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<AsztalDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztal lekérésekor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Új asztal létrehozása
        /// </summary>
        public async Task<AsztalDto> CreateAsztalAsync(AsztalDto asztal)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("asztalok", asztal);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<AsztalDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztal létrehozásakor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Asztal módosítása
        /// </summary>
        public async Task<AsztalDto> UpdateAsztalAsync(int id, AsztalDto asztal)
        {
            try
            {
                var response = await _httpClient.PutAsJsonAsync($"asztalok/{id}", asztal);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<AsztalDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztal módosításakor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Asztal törlése
        /// </summary>
        public async Task<bool> DeleteAsztalAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"asztalok/{id}");
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztal törlésekor: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Szabad asztalok lekérése adott dátumra és időpontra
        /// </summary>
        public async Task<List<AsztalDto>> GetSzabadAsztalokAsync(string datum, string idopont, int? helyekSzama = null)
        {
            try
            {
                var url = $"asztalok/szabad/list?datum={datum}&idopont={idopont}";
                if (helyekSzama.HasValue)
                {
                    url += $"&helyekSzama={helyekSzama.Value}";
                }
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadFromJsonAsync<SzabadAsztalokResponse>();
                return result?.SzabadAsztalok ?? new List<AsztalDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a szabad asztalok lekérésekor: {ex.Message}");
                return new List<AsztalDto>();
            }
        }

        #endregion

        #region Foglalás műveletek

        /// <summary>
        /// Összes foglalás lekérése
        /// </summary>
        public async Task<List<FoglalasDto>> GetFoglalasokAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("foglalasok");
                response.EnsureSuccessStatusCode();
                var foglalasok = await response.Content.ReadFromJsonAsync<List<FoglalasDto>>();
                return foglalasok ?? new List<FoglalasDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalások lekérésekor: {ex.Message}");
                return new List<FoglalasDto>();
            }
        }

        /// <summary>
        /// Egy foglalás lekérése ID alapján
        /// </summary>
        public async Task<FoglalasDto> GetFoglalasByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"foglalasok/{id}");
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<FoglalasDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás lekérésekor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Foglalások lekérése dátum alapján
        /// </summary>
        public async Task<List<FoglalasDto>> GetFoglalasokByDatumAsync(string datum)
        {
            try
            {
                var response = await _httpClient.GetAsync($"foglalasok/datum/list?datum={datum}");
                response.EnsureSuccessStatusCode();
                var foglalasok = await response.Content.ReadFromJsonAsync<List<FoglalasDto>>();
                return foglalasok ?? new List<FoglalasDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalások lekérésekor dátum alapján: {ex.Message}");
                return new List<FoglalasDto>();
            }
        }

        /// <summary>
        /// Új foglalás létrehozása
        /// </summary>
        public async Task<FoglalasDto> CreateFoglalasAsync(FoglalasDto foglalas)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("foglalasok", foglalas);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<FoglalasDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás létrehozásakor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Foglalás módosítása
        /// </summary>
        public async Task<FoglalasDto> UpdateFoglalasAsync(int id, FoglalasDto foglalas)
        {
            try
            {
                var response = await _httpClient.PutAsJsonAsync($"foglalasok/{id}", foglalas);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<FoglalasDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás módosításakor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Foglalás törlése
        /// </summary>
        public async Task<bool> DeleteFoglalasAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"foglalasok/{id}");
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás törlésekor: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Foglalt időpontok lekérése adott dátumra és asztalra
        /// </summary>
        public async Task<List<string>> GetFoglaltIdopontokAsync(string datum, int asztalId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"foglalasok/foglalt-idopontok/list?datum={datum}&asztalId={asztalId}");
                response.EnsureSuccessStatusCode();
                var result = await response.Content.ReadFromJsonAsync<FoglaltIdopontokResponse>();
                return result?.FoglaltIdopontok ?? new List<string>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalt időpontok lekérésekor: {ex.Message}");
                return new List<string>();
            }
        }

        #endregion

        #region Időpont műveletek

        /// <summary>
        /// Összes időpont lekérése
        /// </summary>
        public async Task<List<IdopontDto>> GetIdopontokAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("idopontok");
                response.EnsureSuccessStatusCode();
                var idopontok = await response.Content.ReadFromJsonAsync<List<IdopontDto>>();
                return idopontok ?? new List<IdopontDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpontok lekérésekor: {ex.Message}");
                return new List<IdopontDto>();
            }
        }

        /// <summary>
        /// Egy időpont lekérése ID alapján
        /// </summary>
        public async Task<IdopontDto> GetIdopontByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"idopontok/{id}");
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<IdopontDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpont lekérésekor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Új időpont létrehozása
        /// </summary>
        public async Task<IdopontDto> CreateIdopontAsync(IdopontDto idopont)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("idopontok", idopont);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<IdopontDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpont létrehozásakor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Időpont módosítása
        /// </summary>
        public async Task<IdopontDto> UpdateIdopontAsync(int id, IdopontDto idopont)
        {
            try
            {
                var response = await _httpClient.PutAsJsonAsync($"idopontok/{id}", idopont);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<IdopontDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpont módosításakor: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Időpont törlése
        /// </summary>
        public async Task<bool> DeleteIdopontAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"idopontok/{id}");
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpont törlésekor: {ex.Message}");
                return false;
            }
        }

        #endregion

        #region Segéd osztályok a válaszokhoz

        private class SzabadAsztalokResponse
        {
            [System.Text.Json.Serialization.JsonPropertyName("datum")]
            public string Datum { get; set; }

            [System.Text.Json.Serialization.JsonPropertyName("idopont")]
            public string Idopont { get; set; }

            [System.Text.Json.Serialization.JsonPropertyName("helyek_szama")]
            public string HelyekSzama { get; set; }

            [System.Text.Json.Serialization.JsonPropertyName("szabad_asztalok")]
            public List<AsztalDto> SzabadAsztalok { get; set; }
        }

        private class FoglaltIdopontokResponse
        {
            [System.Text.Json.Serialization.JsonPropertyName("datum")]
            public string Datum { get; set; }

            [System.Text.Json.Serialization.JsonPropertyName("asztal_id")]
            public string AsztalId { get; set; }

            [System.Text.Json.Serialization.JsonPropertyName("foglalt_idopontok")]
            public List<string> FoglaltIdopontok { get; set; }
        }

        #endregion
    }
}

