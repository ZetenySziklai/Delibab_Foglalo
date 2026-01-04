using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using AdatokElerese.Services;
using AdatokElerese.Models;

namespace AdatokElerese
{
    public class AdatokLekerese
    {
        public List<AdatokFeldolgozasa> adatok = new List<AdatokFeldolgozasa>();
        // Asztal kapacitások tárolása (asztal index -> kapacitás)
        public List<int> asztalKapacitasok = new List<int>();
        
        // API szolgáltatás a Backend kommunikációhoz
        private readonly ApiService _apiService;
        
        // Utolsó API hiba üzenet
        public string UtolsoHiba { get; private set; }

        public AdatokLekerese()
        {
            adatok = new List<AdatokFeldolgozasa>();
            asztalKapacitasok = new List<int>();
            _apiService = new ApiService(); // Alapértelmezett: http://localhost:8000/api/
        }

        /// <summary>
        /// Konstruktor egyedi API URL-lel
        /// </summary>
        public AdatokLekerese(string apiBaseUrl)
        {
            adatok = new List<AdatokFeldolgozasa>();
            asztalKapacitasok = new List<int>();
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
                
                if (asztalok == null || asztalok.Count == 0)
                {
                    // Ha nincs asztal az API-ból, töröljük az összes adatot
                    asztalKapacitasok.Clear();
                    adatok.Clear(); // Töröljük az időpontokat is, mert nincs asztal
                    UtolsoHiba = "Nincs asztal az API-ból";
                    return MuveletEredmeny.Hiba(UtolsoHiba);
                }

                // Kapacitások frissítése az API adatokból
                asztalKapacitasok.Clear();
                foreach (var asztal in asztalok)
                {
                    asztalKapacitasok.Add(asztal.HelyekSzama);
                }

                // Időpontok frissítése - minden időponthoz frissítjük az asztalok számát
                // Csak akkor, ha vannak időpontok
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
            catch (Exception ex)
            {
                // Hiba esetén töröljük az összes adatot, hogy ne legyen régi adat
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
                
                if (idopontok == null || idopontok.Count == 0)
                {
                    UtolsoHiba = "Nem sikerült időpontokat lekérni az API-ból";
                    return MuveletEredmeny.Hiba(UtolsoHiba);
                }

                // Időpontok frissítése az API adatokból
                adatok.Clear();
                
                // Összegyűjtjük az összes időpontot (nem csak a mai napra)
                List<IdopontDto> osszesIdopont = new List<IdopontDto>();
                foreach (var idopontDto in idopontok)
                {
                    osszesIdopont.Add(idopontDto);
                }

                // Rendezzük idő szerint (egyszerű buborék rendezés)
                for (int i = 0; i < osszesIdopont.Count - 1; i++)
                {
                    for (int j = i + 1; j < osszesIdopont.Count; j++)
                    {
                        if (osszesIdopont[i].FoglalasNapIdo > osszesIdopont[j].FoglalasNapIdo)
                        {
                            IdopontDto temp = osszesIdopont[i];
                            osszesIdopont[i] = osszesIdopont[j];
                            osszesIdopont[j] = temp;
                        }
                    }
                }

                // Minden időponthoz létrehozunk egy bejegyzést
                foreach (var idopontDto in osszesIdopont)
                {
                    // Időpont formátum: "HH:mm-HH:mm"
                    string idopontString = idopontDto.FoglalasNapIdo.ToString("HH:mm");
                    // Hozzáadjuk a következő órát is (egyszerűsítve)
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
                }

                // Ha nincs időpont az API-ban, üres listát adunk vissza (nem beégetett adatokat)
                if (adatok.Count == 0)
                {
                    // Üres lista - nincs időpont az adatbázisban
                    return MuveletEredmeny.Siker("Nincs időpont az API-ban - üres lista", new List<IdopontDto>());
                }

                return MuveletEredmeny.Siker("Sikeresen lekértünk " + adatok.Count + " időpontot az API-ból", idopontok);
            }
            catch (Exception ex)
            {
                // Hiba esetén töröljük az időpontokat, hogy ne legyen régi adat
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
                var foglalasok = await _apiService.GetFoglalasokByDatumAsync(datum);
                
                return MuveletEredmeny.Siker($"Sikeresen lekértünk {foglalasok.Count} foglalást az API-ból", foglalasok);
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a foglalások lekérésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Összes foglalás lekérése a Backend API-ból
        /// </summary>
        public async Task<MuveletEredmeny> OsszesFoglalasLekereseAPIbol()
        {
            try
            {
                var foglalasok = await _apiService.GetFoglalasokAsync();
                
                return MuveletEredmeny.Siker($"Sikeresen lekértünk {foglalasok.Count} foglalást az API-ból", foglalasok);
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a foglalások lekérésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Szabad asztalok lekérése adott dátumra és időpontra
        /// </summary>
        public async Task<MuveletEredmeny> SzabadAsztalokLekereseAPIbol(string datum, string idopont, int? helyekSzama = null)
        {
            try
            {
                var szabadAsztalok = await _apiService.GetSzabadAsztalokAsync(datum, idopont, helyekSzama);
                
                return MuveletEredmeny.Siker($"Sikeresen lekértünk {szabadAsztalok.Count} szabad asztalt", szabadAsztalok);
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a szabad asztalok lekérésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Összes adat lekérése az API-ból (asztalok + foglalások)
        /// </summary>
        public async Task<MuveletEredmeny> AdatokFrissiteseAPIbol(string datum = null)
        {
            try
            {
                // Asztalok lekérése
                var asztalEredmeny = await AsztalokLekereseAPIbol();
                if (!asztalEredmeny.Sikeres)
                {
                    return asztalEredmeny;
                }

                // Foglalások lekérése (ha van dátum megadva)
                if (!string.IsNullOrEmpty(datum))
                {
                    var foglalasEredmeny = await FoglalasokLekereseAPIbol(datum);
                    if (!foglalasEredmeny.Sikeres)
                    {
                        return foglalasEredmeny;
                    }

                    // Foglalások alapján frissítjük az elérhetőségeket
                    var foglalasok = (List<FoglalasDto>)foglalasEredmeny.Eredmeny;
                    FrissitElerhetosegekFoglalasokAlapjan(foglalasok);
                }

                return MuveletEredmeny.Siker("Adatok sikeresen frissítve az API-ból", null);
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba az adatok frissítésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Frissíti az elérhetőségeket a foglalások alapján
        /// </summary>
        private void FrissitElerhetosegekFoglalasokAlapjan(List<FoglalasDto> foglalasok)
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
            foreach (var foglalas in foglalasok)
            {
                // Megkeressük a megfelelő időpontot
                int asztalIndex = foglalas.AsztalId - 1; // Az ID 1-től kezdődik, az index 0-tól
                
                // Ha van megfelelő asztal, beállítjuk foglaltnak
                foreach (var idopont in adatok)
                {
                    if (asztalIndex >= 0 && asztalIndex < idopont.asztal.Count)
                    {
                        // A foglalás dátumát összehasonlítjuk az időponttal
                        // Itt egyszerűsítve: minden foglalást figyelembe veszünk
                        idopont.asztal[asztalIndex] = false;
                    }
                }
            }
        }

        #endregion

        #region API Mentés metódusok

        /// <summary>
        /// Új asztal mentése az API-ba
        /// </summary>
        public async Task<MuveletEredmeny> AsztalMenteseAPIba(int helyekSzama, int asztalAllapotId = 1)
        {
            try
            {
                var ujAsztal = new AsztalDto
                {
                    HelyekSzama = helyekSzama,
                    AsztalAllapotId = asztalAllapotId
                };

                var eredmeny = await _apiService.CreateAsztalAsync(ujAsztal);
                
                if (eredmeny != null)
                {
                    return MuveletEredmeny.Siker($"Asztal sikeresen mentve az API-ba (ID: {eredmeny.Id})", eredmeny);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült az asztalt menteni az API-ba");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba az asztal mentésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Asztal frissítése az API-ban
        /// </summary>
        public async Task<MuveletEredmeny> AsztalFrissiteseAPIban(int id, int helyekSzama, int asztalAllapotId)
        {
            try
            {
                var frissitettAsztal = new AsztalDto
                {
                    Id = id,
                    HelyekSzama = helyekSzama,
                    AsztalAllapotId = asztalAllapotId
                };

                var eredmeny = await _apiService.UpdateAsztalAsync(id, frissitettAsztal);
                
                if (eredmeny != null)
                {
                    return MuveletEredmeny.Siker($"Asztal sikeresen frissítve az API-ban (ID: {id})", eredmeny);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült az asztalt frissíteni az API-ban");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba az asztal frissítésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Asztal törlése az API-ból
        /// </summary>
        public async Task<MuveletEredmeny> AsztalTorleseAPIbol(int id)
        {
            try
            {
                var sikeres = await _apiService.DeleteAsztalAsync(id);
                
                if (sikeres)
                {
                    return MuveletEredmeny.Siker($"Asztal sikeresen törölve az API-ból (ID: {id})", id);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült az asztalt törölni az API-ból");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba az asztal törlésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Új foglalás mentése az API-ba
        /// </summary>
        public async Task<MuveletEredmeny> FoglalasMenteseAPIba(FoglalasDto foglalas)
        {
            try
            {
                var eredmeny = await _apiService.CreateFoglalasAsync(foglalas);
                
                if (eredmeny != null)
                {
                    return MuveletEredmeny.Siker($"Foglalás sikeresen mentve az API-ba (ID: {eredmeny.Id})", eredmeny);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült a foglalást menteni az API-ba");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a foglalás mentésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Foglalás frissítése az API-ban
        /// </summary>
        public async Task<MuveletEredmeny> FoglalasFrissiteseAPIban(int id, FoglalasDto foglalas)
        {
            try
            {
                var eredmeny = await _apiService.UpdateFoglalasAsync(id, foglalas);
                
                if (eredmeny != null)
                {
                    return MuveletEredmeny.Siker($"Foglalás sikeresen frissítve az API-ban (ID: {id})", eredmeny);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült a foglalást frissíteni az API-ban");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a foglalás frissítésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Foglalás törlése az API-ból
        /// </summary>
        public async Task<MuveletEredmeny> FoglalasTorleseAPIbol(int id)
        {
            try
            {
                var sikeres = await _apiService.DeleteFoglalasAsync(id);
                
                if (sikeres)
                {
                    return MuveletEredmeny.Siker($"Foglalás sikeresen törölve az API-ból (ID: {id})", id);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült a foglalást törölni az API-ból");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a foglalás törlésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Új időpont mentése az API-ba
        /// </summary>
        public async Task<MuveletEredmeny> IdopontMenteseAPIba(IdopontDto idopont)
        {
            try
            {
                var eredmeny = await _apiService.CreateIdopontAsync(idopont);
                
                if (eredmeny != null)
                {
                    return MuveletEredmeny.Siker($"Időpont sikeresen mentve az API-ba (ID: {eredmeny.IdopontId})", eredmeny);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült az időpontot menteni az API-ba");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba az időpont mentésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Időpont törlése az API-ból
        /// </summary>
        public async Task<MuveletEredmeny> IdopontTorleseAPIbol(int id)
        {
            try
            {
                var sikeres = await _apiService.DeleteIdopontAsync(id);
                
                if (sikeres)
                {
                    return MuveletEredmeny.Siker($"Időpont sikeresen törölve az API-ból (ID: {id})", id);
                }
                
                return MuveletEredmeny.Hiba("Nem sikerült az időpontot törölni az API-ból");
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba az időpont törlésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        /// <summary>
        /// Foglalások állapotának mentése az API-ba (a grid-ben lévő állapotok alapján)
        /// </summary>
        public async Task<MuveletEredmeny> FoglalasokAllapotanakMenteseAPIba(string datum)
        {
            try
            {
                // 1. Lekérjük a jelenlegi foglalásokat az adatbázisból
                var foglalasok = await _apiService.GetFoglalasokByDatumAsync(datum);
                
                // 2. Parse-oljuk a dátumot
                DateTime datumObj = DateTime.Parse(datum);
                
                // 3. Összegyűjtjük, hogy melyik asztal-időpont kombinációkhoz van foglalás
                Dictionary<string, FoglalasDto> letezoFoglalasok = new Dictionary<string, FoglalasDto>();
                foreach (var foglalas in foglalasok)
                {
                    // Kulcs: asztalId_idopont
                    string kulcs = $"{foglalas.AsztalId}_{foglalas.FoglalasDatum:HH:mm}";
                    letezoFoglalasok[kulcs] = foglalas;
                }
                
                int letrehozott = 0;
                int torolt = 0;
                
                // 4. Végigmegyünk a grid adatokon
                foreach (var idopont in adatok)
                {
                    // Parse-oljuk az időpontot (pl. "9:00-10:00")
                    string[] reszek = idopont.ido.Split('-');
                    if (reszek.Length == 2)
                    {
                        string kezdoIdo = reszek[0].Trim();
                        string[] kezdoReszek = kezdoIdo.Split(':');
                        if (kezdoReszek.Length == 2)
                        {
                            int ora = int.Parse(kezdoReszek[0]);
                            int perc = int.Parse(kezdoReszek[1]);
                            DateTime idopontDatum = datumObj.Date.AddHours(ora).AddMinutes(perc);
                            
                            // Végigmegyünk az asztalokon
                            for (int asztalIndex = 0; asztalIndex < idopont.asztal.Count; asztalIndex++)
                            {
                                int asztalId = asztalIndex + 1;
                                bool elerheto = idopont.asztal[asztalIndex];
                                string kulcs = $"{asztalId}_{idopontDatum:HH:mm}";
                                
                                if (!elerheto) // Foglalt
                                {
                                    // Ha nincs foglalás, létrehozunk egyet
                                    if (!letezoFoglalasok.ContainsKey(kulcs))
                                    {
                                        var ujFoglalas = new FoglalasDto
                                        {
                                            UserId = 1, // Alapértelmezett user (admin)
                                            AsztalId = asztalId,
                                            FoglalasDatum = idopontDatum,
                                            EtkezesId = 1, // Alapértelmezett
                                            MegjegyzesId = null
                                        };
                                        
                                        var eredmeny = await _apiService.CreateFoglalasAsync(ujFoglalas);
                                        if (eredmeny != null)
                                        {
                                            letrehozott++;
                                        }
                                    }
                                }
                                else // Szabad
                                {
                                    // Ha van foglalás, töröljük
                                    if (letezoFoglalasok.ContainsKey(kulcs))
                                    {
                                        var foglalas = letezoFoglalasok[kulcs];
                                        var sikeres = await _apiService.DeleteFoglalasAsync(foglalas.Id);
                                        if (sikeres)
                                        {
                                            torolt++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                return MuveletEredmeny.Siker($"Foglalások állapota mentve: {letrehozott} létrehozva, {torolt} törölve", null);
            }
            catch (Exception ex)
            {
                UtolsoHiba = $"Hiba a foglalások állapotának mentésekor: {ex.Message}";
                return MuveletEredmeny.Hiba(UtolsoHiba);
            }
        }

        #endregion


        
        /// <summary>
        /// Alapértelmezett adatok létrehozása - NEM HASZNÁL BEÉGETETT ADATOKAT!
        /// Ez a metódus üres, mert csak az API-ból érkező adatokkal dolgozunk.
        /// </summary>
        public void AlapAdatokLetrehozasa()
        {
            // Üres metódus - nem hozunk létre beégetett adatokat
            // Minden adat az API-ból jön
            return;
        }

        /// <summary>
        /// Megszámolja, hány asztal van - CSAK AZ API-BÓL ÉRKEZŐ ADATOKBÓL!
        /// </summary>
        public int SzamolAsztalokSzama()
        {
            // CSAK az asztalKapacitasok listát használjuk, mert az az API-ból jön
            // NEM az adatok listát, mert az régi adatokat tartalmazhat
            return asztalKapacitasok.Count;
        }

        /// <summary>
        /// Új asztal hozzáadása minden időponthoz - NEM HASZNÁL ALAPÉRTELMEZETT ÉRTÉKET!
        /// Ez a metódus nem használható, mert nincs alapértelmezett kapacitás.
        /// </summary>
        public MuveletEredmeny AsztalHozzaadasa()
        {
            return MuveletEredmeny.Hiba("A kapacitást meg kell adni! Használd az AsztalHozzaadasa(kapacitas) metódust.");
        }

        /// <summary>
        /// Új asztal hozzáadása minden időponthoz megadott kapacitással
        /// </summary>
        public MuveletEredmeny AsztalHozzaadasa(int kapacitas)
        {
            try
            {
                int asztalokSzama = SzamolAsztalokSzama();
                
                // Kapacitás hozzáadása
                asztalKapacitasok.Add(kapacitas);
                
                // Minden időponthoz hozzáadjuk az új asztalt (alapértelmezetten elérhető)
                foreach (var idopont in adatok)
                {
                    idopont.asztal.Add(true);
                }

                int ujAsztalSzam = asztalokSzama + 1;
                return MuveletEredmeny.Siker($"Sikeresen hozzáadtál egy új asztalt! (Összesen: {ujAsztalSzam} asztal, Kapacitás: {kapacitas} fő)", ujAsztalSzam);
            }
            catch (Exception ex)
            {
                return MuveletEredmeny.Hiba($"Hiba történt az asztal hozzáadásakor: {ex.Message}");
            }
        }

        /// <summary>
        /// Asztal eltávolítása minden időpontból
        /// </summary>
        public MuveletEredmeny AsztalEltavolitasa(int asztalIndex)
        {
            try
            {
                // Ellenőrizzük, hogy van-e legalább 1 asztal
                int asztalokSzama = SzamolAsztalokSzama();
                if (asztalokSzama <= 1)
                {
                    return MuveletEredmeny.Hiba("Nem lehet eltávolítani az utolsó asztalt! Legalább 1 asztalnak kell lennie.");
                }

                // Ellenőrizzük, hogy érvényes az index
                if (asztalIndex < 0 || asztalIndex >= asztalokSzama)
                {
                    return MuveletEredmeny.Hiba("Érvénytelen asztal index!");
                }

                // Kapacitás eltávolítása
                if (asztalIndex < asztalKapacitasok.Count)
                {
                    asztalKapacitasok.RemoveAt(asztalIndex);
                }
                
                // Minden időpontból eltávolítjuk az asztalt
                foreach (var idopont in adatok)
                {
                    if (asztalIndex < idopont.asztal.Count)
                    {
                        idopont.asztal.RemoveAt(asztalIndex);
                    }
                }

                int maradekAsztal = asztalokSzama - 1;
                return MuveletEredmeny.Siker($"Sikeresen eltávolítottad az asztalt! (Összesen: {maradekAsztal} asztal maradt)", maradekAsztal);
            }
            catch (Exception ex)
            {
                return MuveletEredmeny.Hiba($"Hiba történt az asztal eltávolításakor: {ex.Message}");
            }
        }

        /// <summary>
        /// Új időpont hozzáadása
        /// </summary>
        public MuveletEredmeny IdopontHozzaadasa(string ujIdopont)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(ujIdopont))
                {
                    return MuveletEredmeny.Hiba("Az időpont nem lehet üres!");
                }

                // Ellenőrizzük, hogy nincs-e már ilyen időpont
                foreach (var idopont in adatok)
                {
                    if (idopont.ido == ujIdopont)
                    {
                        return MuveletEredmeny.Hiba("Ez az időpont már létezik!");
                    }
                }

                // Új időpont objektum létrehozása
                AdatokFeldolgozasa ujIdopontObjektum = new AdatokFeldolgozasa();
                ujIdopontObjektum.ido = ujIdopont;

                // Minden asztalhoz hozzáadjuk (alapértelmezetten elérhető) - annyi asztal, amennyi van
                int asztalokSzama = SzamolAsztalokSzama();
                for (int i = 0; i < asztalokSzama; i++)
                {
                    ujIdopontObjektum.asztal.Add(true);
                }

                // Hozzáadás az adatokhoz
                adatok.Add(ujIdopontObjektum);

                return MuveletEredmeny.Siker($"Sikeresen hozzáadtál egy új időpontot: {ujIdopont}", ujIdopont);
            }
            catch (Exception ex)
            {
                return MuveletEredmeny.Hiba($"Hiba történt az időpont hozzáadásakor: {ex.Message}");
            }
        }

        /// <summary>
        /// Időpont eltávolítása
        /// </summary>
        public MuveletEredmeny IdopontEltavolitasa(int idopontIndex)
        {
            try
            {
                // Ellenőrizzük, hogy van-e legalább 1 időpont
                if (adatok.Count <= 1)
                {
                    return MuveletEredmeny.Hiba("Nem lehet eltávolítani az utolsó időpontot! Legalább 1 időpontnak kell lennie.");
                }

                // Ellenőrizzük, hogy érvényes az index
                if (idopontIndex < 0 || idopontIndex >= adatok.Count)
                {
                    return MuveletEredmeny.Hiba("Érvénytelen időpont index!");
                }

                string torlendoIdopont = adatok[idopontIndex].ido;

                // Időpont eltávolítása
                adatok.RemoveAt(idopontIndex);

                return MuveletEredmeny.Siker($"Sikeresen eltávolítottad az időpontot: {torlendoIdopont}", torlendoIdopont);
            }
            catch (Exception ex)
            {
                return MuveletEredmeny.Hiba($"Hiba történt az időpont eltávolításakor: {ex.Message}");
            }
        }

        /// <summary>
        /// Foglalás státuszának megváltoztatása (zöld <-> piros)
        /// </summary>
        public MuveletEredmeny FoglalasValtoztatasa(int idopontIndex, int asztalIndex)
        {
            try
            {
                // Ellenőrizzük az indexeket
                if (idopontIndex < 0 || idopontIndex >= adatok.Count)
                {
                    return MuveletEredmeny.Hiba("Érvénytelen időpont index!");
                }

                AdatokFeldolgozasa idopont = adatok[idopontIndex];
                
                // Biztosítjuk, hogy van elég asztal
                while (idopont.asztal.Count <= asztalIndex)
                {
                    idopont.asztal.Add(true);
                }
                
                // Érték megfordítása (true -> false, false -> true)
                bool jelenlegiElerheto = idopont.asztal[asztalIndex];
                bool ujElerheto = !jelenlegiElerheto;
                idopont.asztal[asztalIndex] = ujElerheto;

                string uzenet = ujElerheto 
                    ? $"Az asztal mostantól elérhető! (Időpont: {idopont.ido}, Asztal: {asztalIndex + 1})"
                    : $"Az asztal mostantól foglalt! (Időpont: {idopont.ido}, Asztal: {asztalIndex + 1})";

                return MuveletEredmeny.Siker(uzenet, ujElerheto);
            }
            catch (Exception ex)
            {
                return MuveletEredmeny.Hiba($"Hiba történt a foglalás változtatásakor: {ex.Message}");
            }
        }

        /// <summary>
        /// Visszaadja az adott időpont és asztal elérhetőségét
        /// </summary>
        public bool GetElerhetoseg(int idopontIndex, int asztalIndex)
        {
            if (idopontIndex < 0 || idopontIndex >= adatok.Count)
                return true; // Alapértelmezett: elérhető

            AdatokFeldolgozasa idopont = adatok[idopontIndex];
            
            if (asztalIndex < 0 || asztalIndex >= idopont.asztal.Count)
                return true; // Alapértelmezett: elérhető

            return idopont.asztal[asztalIndex];
        }

        /// <summary>
        /// Visszaadja az adott időpont adatait
        /// </summary>
        public AdatokFeldolgozasa GetIdopont(int idopontIndex)
        {
            if (idopontIndex >= 0 && idopontIndex < adatok.Count)
            {
                return adatok[idopontIndex];
            }
            return null;
        }

        // Régi metódusok (API kapcsolatokhoz - később használjuk)
        
    }
}
