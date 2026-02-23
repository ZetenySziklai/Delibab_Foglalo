using System.Text.Json.Serialization;

namespace AdminWPF.Models
{
    public class Idopont
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        // pl. 6.5 = 06:30, 9 = 09:00
        [JsonPropertyName("kezdet")]
        public double Kezdet { get; set; }

        [JsonPropertyName("veg")]
        public double Veg { get; set; }

        public override string ToString() => $"{DoubleToIdo(Kezdet)} - {DoubleToIdo(Veg)}";

        public static string DoubleToIdo(double ertek)
        {
            int ora = (int)ertek;
            int perc = (int)Math.Round((ertek - ora) * 60);
            return $"{ora:D2}:{perc:D2}";
        }
    }

    public class IdopontLetrehozas
    {
        [JsonPropertyName("kezdet")]
        public double Kezdet { get; set; }

        [JsonPropertyName("veg")]
        public double Veg { get; set; }
    }
}
