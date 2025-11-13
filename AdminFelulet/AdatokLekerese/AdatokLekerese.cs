using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
//Konstruktor

namespace AdatokElerese
{
    public class AdatokLekerese
    {
        public List<AdatokFeldolgozasa> adatok = new List<AdatokFeldolgozasa>();
        static void Main(string[] args)
        {
            Fajlbeolvasas();
        }
        public static void Fajlbeolvasas()
        {
            StreamReader f = new StreamReader("teszt_adatok");
            f.ReadLine();
            while (!f.EndOfStream)
            {
                AdatokFeldolgozasa s = new AdatokFeldolgozasa(f.ReadLine());
                adatok.Add(s);
            }
            f.Close();
        }
        public void FoglalasValtoztatas()
        {
            for(int i = 0; i < adatok.Count; i++)
            {
                for(int j=0; j < adatok[i].asztal.Count; j++)
                {
                    Eldontes(adatok[i].asztal[j]);
                }
            }
        }
        public bool Eldontes(bool adat)
        {
            if (adat == false)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        



    }
}
