using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdatokElerese
{
    public class AdatokFeldolgozasa
    {
        public string ido;
        public List<bool> asztal;

        public AdatokFeldolgozasa(string sor)
        {
            
            string[] adatok = sor.Split(';');
            ido = adatok[0];
            for(int i = 1; i < adatok.Length; i++)
            {
                asztal.Add(Convert.ToBoolean(adatok[i]));
            }
        }
    }
}
