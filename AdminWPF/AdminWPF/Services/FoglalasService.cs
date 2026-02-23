using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
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

        public async Task<bool> CreateFoglalasAsync(FoglalasLetrehozas foglalas)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/api/foglalasok", foglalas);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás létrehozásakor: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteFoglalasAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"/api/foglalasok/{id}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a foglalás törlésekor: {ex.Message}");
                return false;
            }
        }
    }
}
