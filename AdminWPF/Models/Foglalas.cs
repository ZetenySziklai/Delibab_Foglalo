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

        // A foglalás saját id-ja (törléshez kell)
        public int? FoglalaId => Id > 0 ? Id : null;

        // foglalasiadatok mezők – a WPF rács ezeket mutatja
        [JsonPropertyName("megjegyzes")]
        public string? Megjegyzes { get; set; }

        [JsonPropertyName("felnott")]
        public int? Felnott { get; set; }

        [JsonPropertyName("gyerek")]
        public int? Gyerek { get; set; }
    }

    // POST /api/foglalasok – pontosan azt küldjük amit a backend vár
    public class FoglalasLetrehozas
    {
        [JsonPropertyName("user_id")]
        public int FelhasznaloId { get; set; } = 1;

        [JsonPropertyName("asztal_id")]
        public int AsztalId { get; set; }

        [JsonPropertyName("IdopontId")]
        public int IdopontId { get; set; }

        // Jövőbeli dátum – a backend ezt ellenőrzi!
        // Holnap ugyanilyen óra/perc, hogy biztosan jövőbeli legyen
        [JsonPropertyName("foglalas_datum")]
        public string FoglaiasDatum { get; set; } =
            DateTime.Now.AddDays(1).ToString("yyyy-MM-dd HH:mm:ss");
    }

    // POST /api/foglalasi-adatok – snake_case, foglalas_id!
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

        // Backend snake_case FK neve: foglalas_id
        [JsonPropertyName("foglalas_id")]
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
