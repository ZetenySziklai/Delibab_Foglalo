using System;
using System.Text.Json.Serialization;

namespace AdminWPF.Models
{
    /// <summary>
    /// DTO osztály az időpont adatokhoz - Backend API-val való kommunikációhoz
    /// </summary>
    public class IdopontDto
    {
        [JsonPropertyName("idopont_id")]
        public int IdopontId { get; set; }

        [JsonPropertyName("foglalas_nap_ido")]
        public DateTime FoglalasNapIdo { get; set; }
    }
}

