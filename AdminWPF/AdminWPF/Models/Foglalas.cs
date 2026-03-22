using System.Text.Json.Serialization;

namespace AdminWPF.Models
{
    // DB: foglalas(id, user_id, asztal_id, IdopontId, foglalas_datum)
    public class Foglalas
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("user_id")]
        public int FelhasznaloId { get; set; }

        [JsonPropertyName("asztal_id")]
        public int AsztalId { get; set; }

        [JsonPropertyName("IdopontId")]
        public int IdopontId { get; set; }

        [JsonPropertyName("foglalas_datum")]
        public string? FoglaiasDatum { get; set; }

        [JsonPropertyName("megjegyzes")]
        public string? Megjegyzes { get; set; }

        [JsonPropertyName("felnott")]
        public int? Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int? Gyerek { get; set; }

        // foglalasiadatok.foglalas_datum – a FOGLALT NAP (betöltéskor töltjük ki)
        public string? FoglaltNap { get; set; }

        public int? FoglalasiAdatokId { get; set; }
    }

    // POST /api/foglalasok
    public class FoglalasLetrehozas
    {
        [JsonPropertyName("user_id")]
        public int FelhasznaloId { get; set; }

        [JsonPropertyName("asztal_id")]
        public int AsztalId { get; set; }

        [JsonPropertyName("IdopontId")]
        public int IdopontId { get; set; }

        [JsonPropertyName("foglalas_datum")]
        public string FoglaiasDatum { get; set; } = "";
    }

    // POST /api/foglalasi-adatok
    public class FoglalasiadatokLetrehozas
    {
        [JsonPropertyName("foglalas_datum")]
        public string FoglaiasDatum { get; set; } = "";

        [JsonPropertyName("megjegyzes")]
        public string Megjegyzes { get; set; } = "";

        [JsonPropertyName("felnott")]
        public int Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int Gyerek { get; set; }

        // A DB oszlopneve FoglalasId → Sequelize ezt fogadja el
        [JsonPropertyName("FoglalasId")]
        public int FoglalaId { get; set; }
    }

    public class RacsCella
    {
        public int AsztalId { get; set; }
        public int IdopontId { get; set; }
        public double IdopontKezdet { get; set; }
        public DateTime FoglalasDatum { get; set; }
        public bool Foglalt { get; set; }
        public int? FoglalasId { get; set; }
        public int? FoglalasiAdatokId { get; set; }

        public int FelhasznaloId { get; set; } = 0;
        public string Megjegyzes { get; set; } = "";
        public int Felnott { get; set; }
        public int Gyerek { get; set; }

        // Eredeti DB-s adatok – visszaállításhoz ha nincs valódi változás
        public int EredetiDmFelhasznaloId { get; set; } = 0;
        public int EredetiFelnott { get; set; } = 0;
        public int EredetiGyerek { get; set; } = 0;
        public string EredetiMegjegyzes { get; set; } = "";
    }
}
