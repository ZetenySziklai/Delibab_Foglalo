using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using AdminWPF.Models;

namespace AdminWPF.Services
{
    /// <summary>
    /// HTTP kliens szolgáltatás a Backend API-val való kommunikációhoz
    /// </summary>
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        /// <summary>
        /// Konstruktor - alapértelmezett URL: http://localhost:8000/api
        /// </summary>
        public ApiService(string baseUrl = "http://localhost:8000/api")
        {
            _baseUrl = baseUrl;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(_baseUrl);
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            _httpClient.Timeout = TimeSpan.FromSeconds(10); // 10 másodperces timeout
        }

        #region Asztal műveletek

        /// <summary>
        /// Összes asztal lekérése
        /// </summary>
        public async Task<List<AsztalDto>> GetAsztalokAsync()
        {
            try
            {
                string url = "http://localhost:8000/api/asztalok";
                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"HTTP {response.StatusCode}: {errorContent}");
                }
                
                response.EnsureSuccessStatusCode();
                var asztalok = await response.Content.ReadFromJsonAsync<List<AsztalDto>>();
                return asztalok ?? new List<AsztalDto>();
            }
            catch (TaskCanceledException ex)
            {
                throw new HttpRequestException($"Timeout: Az API nem válaszolt 10 másodpercen belül. Ellenőrizd, hogy fut-e a backend (http://localhost:8000)", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new HttpRequestException($"Hiba az asztalok lekérésekor: {ex.Message}. URL: {_baseUrl}/asztalok", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Váratlan hiba az asztalok lekérésekor: {ex.Message}. URL: {_baseUrl}/asztalok", ex);
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
                string url = $"foglalasok/datum/list?datum={datum}";
                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"HTTP {response.StatusCode}: {errorContent}");
                }
                
                response.EnsureSuccessStatusCode();
                var foglalasok = await response.Content.ReadFromJsonAsync<List<FoglalasDto>>();
                return foglalasok ?? new List<FoglalasDto>();
            }
            catch (TaskCanceledException ex)
            {
                throw new HttpRequestException($"Timeout: Az API nem válaszolt 10 másodpercen belül. Ellenőrizd, hogy fut-e a backend (http://localhost:8000)", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new HttpRequestException($"Hiba a foglalások lekérésekor dátum alapján: {ex.Message}. URL: {_baseUrl}/foglalasok/datum/list?datum={datum}", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Váratlan hiba a foglalások lekérésekor: {ex.Message}. URL: {_baseUrl}/foglalasok/datum/list?datum={datum}", ex);
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

        #endregion

        #region Időpont műveletek

        /// <summary>
        /// Összes időpont lekérése
        /// </summary>
        public async Task<List<IdopontDto>> GetIdopontokAsync()
        {
            try
            {
                string url = "idopontok";
                var response = await _httpClient.GetAsync(url);
                
                if (!response.IsSuccessStatusCode)
                {
                    string errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"HTTP {response.StatusCode}: {errorContent}");
                }
                
                response.EnsureSuccessStatusCode();
                var idopontok = await response.Content.ReadFromJsonAsync<List<IdopontDto>>();
                return idopontok ?? new List<IdopontDto>();
            }
            catch (TaskCanceledException ex)
            {
                throw new HttpRequestException($"Timeout: Az API nem válaszolt 10 másodpercen belül. Ellenőrizd, hogy fut-e a backend (http://localhost:8000)", ex);
            }
            catch (HttpRequestException ex)
            {
                throw new HttpRequestException($"Hiba az időpontok lekérésekor: {ex.Message}. URL: {_baseUrl}/idopontok", ex);
            }
            catch (Exception ex)
            {
                throw new Exception($"Váratlan hiba az időpontok lekérésekor: {ex.Message}. URL: {_baseUrl}/idopontok", ex);
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
    }
}

