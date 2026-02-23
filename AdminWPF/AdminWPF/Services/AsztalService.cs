using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using AdminWPF.Models;

namespace AdminWPF.Services
{
    public class AsztalService
    {
        private readonly HttpClient _httpClient;

        public AsztalService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Asztal>> GetAsztalokAsync()
        {
            try
            {
                var result = await _httpClient.GetFromJsonAsync<List<Asztal>>("/api/asztalok");
                return result ?? new List<Asztal>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztalok lekérésekor: {ex.Message}");
                return new List<Asztal>();
            }
        }

        public async Task<bool> CreateAsztalAsync(AsztalLetrehozas asztal)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/api/asztalok", asztal);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztal létrehozásakor: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteAsztalAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"/api/asztalok/{id}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az asztal törlésekor: {ex.Message}");
                return false;
            }
        }
    }
}
