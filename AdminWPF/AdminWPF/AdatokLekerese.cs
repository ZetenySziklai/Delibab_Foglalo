using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AdminWPF.Models;
using AdminWPF.Services;

namespace AdminWPF
{
    /// <summary>
    /// Osztály az adatok kezeléséhez - CSAK API-t használ, nincs helyi fájl!
    /// </summary>
    public class AdatokLekerese
    {
        public List<AdatokFeldolgozasa> adatok = new List<AdatokFeldolgozasa>();
        // Asztal kapacitások tárolása (asztal index -> kapacitás)
        public List<int> asztalKapacitasok = new List<int>();
        // Asztal ID-k tárolása (asztal index -> asztal ID)
        public List<int> asztalIds = new List<int>();
        // Időpont ID-k tárolása (időpont index -> időpont ID)
        public List<int> idopontIds = new List<int>();
        // Foglalások tárolása (cella kattintáshoz és mentéshez)
        public List<FoglalasDto> foglalasok = new List<FoglalasDto>();
        // Törölt foglalások ID-i (mentéskor törlődnek az API-ból)
        public List<int> toroltFoglalasIds = new List<int>();
        
        // API szolgáltatás a Backend kommunikációhoz
        private readonly ApiService _apiService;
        
        // Utolsó API hiba üzenet
        public string UtolsoHiba { get; private set; }

        public AdatokLekerese()
        {
            adatok = new List<AdatokFeldolgozasa>();
            asztalKapacitasok = new List<int>();
            asztalIds = new List<int>();
            idopontIds = new List<int>();
            foglalasok = new List<FoglalasDto>();
            toroltFoglalasIds = new List<int>();
            _apiService = new ApiService(); // Alapértelmezett: http://localhost:8000/api
        }

        /// <summary>
        /// Konstruktor egyedi API URL-lel
        /// </summary>
        public AdatokLekerese(string apiBaseUrl)
        {
            adatok = new List<AdatokFeldolgozasa>();
            asztalKapacitasok = new List<int>();
            asztalIds = new List<int>();
            idopontIds = new List<int>();
            foglalasok = new List<FoglalasDto>();
            toroltFoglalasIds = new List<int>();
            _apiService = new ApiService(apiBaseUrl);
        }

        #region API Lekérés metódusok

        /// <summary>
        /// Asztalok lekérése a Backend API-ból
        /// </summary>
        public async Task<MuveletEredmeny> AsztalokLekereseAPIbol()
        {
            try
            {
                var asztalok = await _apiService.GetAsztalokAsync();
                
                // Kapacitások és ID-k frissítése az API adatokból
                asztalKapacitasok.Clear();
                asztalIds.Clear();
                
                if (asztalok != null && asztalok.Count > 0)
                {
                    foreach (var asztal in asztalok)
                    {
                        asztalKapacitasok.Add(asztal.HelyekSzama);
                        asztalIds.Add(asztal.Id);
                    }

                    // Időpontok frissítése - minden időponthoz frissítjük az asztalok számát
                    foreach (var idopont in adatok)
                    {
                        // Töröljük a régi asztalokat
                        idopont.asztal.Clear();
                        // Hozzáadjuk az új asztalokat (alapértelmezetten elérhető)
                        for (int i = 0; i < asztalok.Count; i++)
                        {
                            idopont.asztal.Add(true);
                        }
                    }

                    return MuveletEredmeny.Siker("Sikeresen lekértünk " + asztalok.Count + " asztalt az API-ból", asztalok);
                }
                else
                {
                    // Ha nincs asztal, ez NEM hiba - csak üres lista
                    // Töröljük az időpontokból az asztalokat
                    foreach (var idopont in adatok)
                    {
                        idopont.asztal.Clear();
                    }
                    return MuveletEredmeny.Siker("Nincs asztal az adatbázisban - üres lista", new List<AsztalDto>());
                }
            }
            catch (Exception ex)
            {
                // Hiba esetén töröljük az összes adatot
                asztalKapacitasok.Clear();
                adatok.Clear();
                UtolsoHiba = "Hiba az asztalok lekérésekor: " + ex.Message;
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Időpontok lekérése a Backend API-ból
        /// </summary>
        public async Task<MuveletEredmeny> IdopontokLekereseAPIbol()
        {
            try
            {
                var idopontok = await _apiService.GetIdopontokAsync();
                
                // Időpontok frissítése az API adatokból
                adatok.Clear();
                idopontIds.Clear();
                
                if (idopontok != null && idopontok.Count > 0)
                {
                    // Rendezzük idő szerint
                    var rendezettIdopontok = idopontok.OrderBy(i => i.FoglalasNapIdo).ToList();

                    // Minden időponthoz létrehozunk egy bejegyzést
                    foreach (var idopontDto in rendezettIdopontok)
                    {
                        // Időpont formátum: "HH:mm-HH:mm"
                        string idopontString = idopontDto.FoglalasNapIdo.ToString("HH:mm");
                        // Hozzáadjuk a következő órát is
                        int kovetkezoOra = idopontDto.FoglalasNapIdo.Hour + 1;
                        string kovetkezoOraString = kovetkezoOra.ToString("00") + ":00";
                        string idopontTeljes = idopontString + "-" + kovetkezoOraString;

                        AdatokFeldolgozasa ujIdopont = new AdatokFeldolgozasa();
                        ujIdopont.ido = idopontTeljes;
                        
                        // Minden asztalhoz hozzáadjuk (alapértelmezetten elérhető)
                        for (int i = 0; i < asztalKapacitasok.Count; i++)
                        {
                            ujIdopont.asztal.Add(true);
                        }
                        
                        adatok.Add(ujIdopont);
                        idopontIds.Add(idopontDto.IdopontId);
                    }

                    return MuveletEredmeny.Siker("Sikeresen lekértünk " + adatok.Count + " időpontot az API-ból", idopontok);
                }
                else
                {
                    // Ha nincs időpont, ez NEM hiba - csak üres lista
                    return MuveletEredmeny.Siker("Nincs időpont az API-ban - üres lista", new List<IdopontDto>());
                }
            }
            catch (Exception ex)
            {
                // Hiba esetén töröljük az időpontokat
                adatok.Clear();
                UtolsoHiba = "Hiba az időpontok lekérésekor: " + ex.Message;
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Foglalások lekérése a Backend API-ból egy adott dátumra
        /// </summary>
        public async Task<MuveletEredmeny> FoglalasokLekereseAPIbol(string datum)
        {
            try
            {
                var foglalasokLista = await _apiService.GetFoglalasokByDatumAsync(datum);
                foglalasok = foglalasokLista ?? new List<FoglalasDto>();
                
                return MuveletEredmeny.Siker($"Sikeresen lekértünk {foglalasok.Count} foglalást az API-ból", foglalasok);
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a foglalások lekérésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Frissíti az elérhetőségeket a foglalások alapján
        /// </summary>
        public void FrissitElerhetosegekFoglalasokAlapjan(List<FoglalasDto> foglalasokLista)
        {
            // Minden időpontot elérhető-ra állítunk alapból
            foreach (var idopont in adatok)
            {
                for (int i = 0; i < idopont.asztal.Count; i++)
                {
                    idopont.asztal[i] = true;
                }
            }

            // Foglalások alapján beállítjuk a foglalt asztalokat
            foreach (var foglalas in foglalasokLista)
            {
                // Keresünk az asztalIds listában az asztal ID-ja alapján
                int asztalIndex = -1;
                for (int i = 0; i < asztalIds.Count; i++)
                {
                    if (asztalIds[i] == foglalas.AsztalId)
                    {
                        asztalIndex = i;
                        break;
                    }
                }
                
                // Ha van megfelelő asztal, beállítjuk foglaltnak
                if (asztalIndex >= 0)
                {
                    // Keresünk az időpontok között
                    DateTime foglalasIdo = foglalas.FoglalasDatum;
                    for (int i = 0; i < adatok.Count; i++)
                    {
                        var idopont = adatok[i];
                        // Ellenőrizzük, hogy az időpont egyezik-e
                        if (asztalIndex < idopont.asztal.Count)
                        {
                            // A foglalás dátumát összehasonlítjuk a mai dátummal
                            DateTime foglalasDatum = foglalas.FoglalasDatum.Date;
                            DateTime maiDatum = DateTime.Now.Date;
                            
                            if (foglalasDatum == maiDatum)
                            {
                                // Ellenőrizzük, hogy az időpont egyezik-e
                                // Az idopont.ido formátuma: "HH:mm-HH:mm" (pl. "9:00-10:00")
                                string foglalasIdoString = foglalasIdo.ToString("HH:mm");
                                string idopontKezdete = idopont.ido.Split('-')[0];
                                
                                if (foglalasIdoString == idopontKezdete)
                                {
                                    idopont.asztal[asztalIndex] = false;
                                }
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Megszámolja, hány asztal van - CSAK AZ API-BÓL ÉRKEZŐ ADATOKBÓL!
        /// </summary>
        public int SzamolAsztalokSzama()
        {
            return asztalKapacitasok.Count;
        }

        #endregion
    }
}
