using System;
using System.Text.Json.Serialization;

namespace AdatokElerese.Models
{
    /// <summary>
    /// DTO osztály a foglalás adatokhoz - Backend API-val való kommunikációhoz
    /// </summary>
    public class FoglalasDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("user_id")]
        public int UserId { get; set; }

        [JsonPropertyName("asztal_id")]
        public int AsztalId { get; set; }

        [JsonPropertyName("foglalas_datum")]
        public DateTime FoglalasDatum { get; set; }

        [JsonPropertyName("etkezes_id")]
        public int EtkezesId { get; set; }

        [JsonPropertyName("megjegyzes_id")]
        public int? MegjegyzesId { get; set; }
    }
}

