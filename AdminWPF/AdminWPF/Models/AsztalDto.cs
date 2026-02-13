using System.Text.Json.Serialization;

namespace AdminWPF.Models
{
    /// <summary>
    /// DTO osztály az asztal adatokhoz - Backend API-val való kommunikációhoz
    /// </summary>
    public class AsztalDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("helyek_szama")]
        public int HelyekSzama { get; set; }

        [JsonPropertyName("asztal_allapot_id")]
        public int AsztalAllapotId { get; set; }
    }
}

