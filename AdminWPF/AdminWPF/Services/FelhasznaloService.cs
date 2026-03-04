using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AdminWPF.Services
{
    public class Felhasznalo
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("vezeteknev")]
        public string Vezeteknev { get; set; } = "";

        [JsonPropertyName("keresztnev")]
        public string Keresztnev { get; set; } = "";

        [JsonPropertyName("email")]
        public string Email { get; set; } = "";

        public string TeljesNev => $"{Vezeteknev} {Keresztnev}";
        public override string ToString() => $"{Vezeteknev} {Keresztnev}  ({Email})";
    }

    public class FelhasznaloService
    {
        private readonly HttpClient _httpClient;

        public FelhasznaloService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Felhasznalo>> GetFelhasznalokAsync()
        {
            try
            {
                var result = await _httpClient.GetFromJsonAsync<List<Felhasznalo>>("/api/users");
                return result ?? new List<Felhasznalo>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Hiba a felhasználók lekérésekor: {ex.Message}");
                return new List<Felhasznalo>();
            }
        }
    }
}
