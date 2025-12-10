using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace AdatokElerese
{
    public class AdatokFeldolgozasa
    {
        [JsonPropertyName("ido")]
        public string ido { get; set; }

        [JsonPropertyName("asztal")]
        public List<bool> asztal { get; set; }

        // Default constructor for JSON deserialization
        public AdatokFeldolgozasa()
        {
            asztal = new List<bool>();
        }

        // Constructor for CSV parsing (if you still need it)
        public AdatokFeldolgozasa(string sor)
        {
            asztal = new List<bool>(); // Initialize the list
            string[] adatok = sor.Split(';');
            ido = adatok[0];
            for (int i = 1; i < adatok.Length; i++)
            {
                asztal.Add(Convert.ToBoolean(adatok[i]));
            }
        }
    }
}
