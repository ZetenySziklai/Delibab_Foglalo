using System.Text.Json.Serialization;

namespace AdminWPF.Models
{
    // DB: asztal(id, helyek_szama) - nincs asztal_allapot_id!
    public class Asztal
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("helyek_szama")]
        public int HelyekSzama { get; set; }

        public override string ToString() => $"Asztal #{Id} ({HelyekSzama} fő)";
    }

    public class AsztalLetrehozas
    {
        [JsonPropertyName("helyek_szama")]
        public int HelyekSzama { get; set; }
    }
}
