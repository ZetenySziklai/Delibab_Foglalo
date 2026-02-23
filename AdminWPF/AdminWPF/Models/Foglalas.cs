using System.Text.Json.Serialization;

namespace AdminWPF.Models
{
    // DB: foglalas(id, FelhasznaloId, AsztalId, IdopontId, FoglalaId)
    // Sequelize belongsTo => nagy kezdőbetűs FK nevek!
    public class Foglalas
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("FelhasznaloId")]
        public int FelhasznaloId { get; set; }

        [JsonPropertyName("AsztalId")]
        public int AsztalId { get; set; }

        [JsonPropertyName("IdopontId")]
        public int IdopontId { get; set; }

        [JsonPropertyName("FoglalaId")]
        public int? FoglalaId { get; set; }
    }

    // POST-hoz
    public class FoglalasLetrehozas
    {
        [JsonPropertyName("FelhasznaloId")]
        public int FelhasznaloId { get; set; } = 1;

        [JsonPropertyName("AsztalId")]
        public int AsztalId { get; set; }

        [JsonPropertyName("IdopontId")]
        public int IdopontId { get; set; }
    }

    public class RacsCella
    {
        public int AsztalId { get; set; }
        public int IdopontId { get; set; }
        public double IdopontKezdet { get; set; }
        public bool Foglalt { get; set; }
        public int? FoglalasId { get; set; }
    }
}
