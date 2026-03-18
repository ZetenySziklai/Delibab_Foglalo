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

        // foglalasiadatok mezők (join-ból jönnek vissza)
        [JsonPropertyName("megjegyzes")]
        public string? Megjegyzes { get; set; }

        [JsonPropertyName("felnott")]
        public int? Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int? Gyerek { get; set; }

        // foglalasiadatok.foglalas_datum – a FOGLALT NAP (betöltéskor töltjük ki)
        // Ez alapján szűr a rács a kiválasztott dátumra
        public string? FoglaltNap { get; set; }

        public int? FoglalasiAdatokId { get; set; }

        // Join-olt foglalasiAdatok (backend include-dal adja vissza)
        [JsonPropertyName("foglalasiAdatok")]
        public FoglalasiAdatokBeagyazott? FoglalasiAdatok { get; set; }
    }

    public class FoglalasiAdatokBeagyazott
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("foglalas_datum")]
        public string? FoglaiasDatum { get; set; }

        [JsonPropertyName("felnott")]
        public int Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int Gyerek { get; set; }

        [JsonPropertyName("megjegyzes")]
        public string? Megjegyzes { get; set; }
    }

    // POST /api/foglalasok
    public class FoglalasLetrehozas
    {
        [JsonPropertyName("user_id")]
        public int FelhasznaloId { get; set; } = 1;

        [JsonPropertyName("asztal_id")]
        public int AsztalId { get; set; }

        [JsonPropertyName("IdopontId")]
        public int IdopontId { get; set; }

        [JsonPropertyName("foglalas_datum")]
        public string FoglaiasDatum { get; set; } =
            DateTime.Now.AddDays(1).ToString("yyyy-MM-dd HH:mm:ss");
    }

    // POST /api/foglalasi-adatok
    // A DB-ben a FK oszlop neve: FoglalaId (Sequelize auto-generált, Foglalas → FoglalasiAdatok hasOne)
    public class FoglalasiadatokLetrehozas
    {
        [JsonPropertyName("foglalas_datum")]
        public string FoglaiasDatum { get; set; } =
            DateTime.Now.AddDays(1).ToString("yyyy-MM-dd HH:mm:ss");

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
        public bool Foglalt { get; set; }
        public int? FoglalasId { get; set; }       // foglalas.id – törléshez
        public int? FoglalasiAdatokId { get; set; } // foglalasiadatok.id – törléshez

        public int FelhasznaloId { get; set; } = 1;
        public string Megjegyzes { get; set; } = "";
        public int Felnott { get; set; }
        public int Gyerek { get; set; }
    }
}
