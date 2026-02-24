using System.Text.Json.Serialization;

namespace AdminWPF.Models
{
    // DB: foglalas(id, FelhasznaloId, AsztalId, IdopontId, FoglalaId)
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

        // foglalasiadatok mezők (opcionálisan visszajönnek az API-ból join-nal)
        [JsonPropertyName("megjegyzes")]
        public string? Megjegyzes { get; set; }

        [JsonPropertyName("felnott")]
        public int? Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int? Gyerek { get; set; }
    }

    // POST-hoz (foglalas tábla)
    public class FoglalasLetrehozas
    {
        [JsonPropertyName("FelhasznaloId")]
        public int FelhasznaloId { get; set; } = 1;

        [JsonPropertyName("AsztalId")]
        public int AsztalId { get; set; }

        [JsonPropertyName("IdopontId")]
        public int IdopontId { get; set; }
    }

    // A foglalasiadatok táblához (POST)
    public class FoglalasiadatokLetrehozas
    {
        [JsonPropertyName("foglalas_datum")]
        public string FoglaiasDatum { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

        [JsonPropertyName("megjegyzes")]
        public string Megjegyzes { get; set; } = "";

        [JsonPropertyName("felnott")]
        public int Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int Gyerek { get; set; }

        [JsonPropertyName("FoglalaId")]
        public int FoglalaId { get; set; }
    }

    public class RacsCella
    {
        public int AsztalId { get; set; }
        public int IdopontId { get; set; }
        public double IdopontKezdet { get; set; }
        public bool Foglalt { get; set; }
        public int? FoglalasId { get; set; }
        public int? FoglalaId { get; set; }   // foglalasiadatok FK – törléshez kell

        // Foglaláshoz tartozó adatok (ha foglalt)
        public int FelhasznaloId { get; set; } = 1;
        public string Megjegyzes { get; set; } = "";
        public int Felnott { get; set; }
        public int Gyerek { get; set; }
    }
}
