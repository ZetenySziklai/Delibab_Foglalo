using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using AdminWPF.Models;

namespace AdminWPF.Services
{
    public class IdopontService
    {
        private readonly HttpClient _httpClient;

        public IdopontService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Idopont>> GetIdopontokAsync()
        {
            try
            {
                var result = await _httpClient.GetFromJsonAsync<List<Idopont>>("/api/idopontok");
                return result ?? new List<Idopont>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpontok lekérésekor: {ex.Message}");
                return new List<Idopont>();
            }
        }

        public async Task<bool> CreateIdopontAsync(IdopontLetrehozas idopont)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/api/idopontok", idopont);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpont létrehozásakor: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteIdopontAsync(int id)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"/api/idopontok/{id}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba az időpont törlésekor: {ex.Message}");
                return false;
            }
        }
    }
}
