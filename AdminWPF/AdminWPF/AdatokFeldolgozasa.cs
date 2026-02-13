using System.Collections.Generic;

namespace AdminWPF
{
    /// <summary>
    /// Időpont adat osztály - hasonló az AdminFelulet/AdatokFeldolgozasa osztályhoz
    /// </summary>
    public class AdatokFeldolgozasa
    {
        public string ido { get; set; }
        public List<bool> asztal { get; set; }

        public AdatokFeldolgozasa()
        {
            asztal = new List<bool>();
        }
    }
}

