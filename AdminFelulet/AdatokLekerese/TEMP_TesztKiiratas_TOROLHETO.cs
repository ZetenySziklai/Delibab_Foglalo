/*
 * ============================================
 * IDEIGLENES TESZT FÁJL - TÖRÖLHETŐ!
 * ============================================
 * 
 * Ez a fájl csak tesztelési célokat szolgál.
 * Amikor legközelebb használod a Cursor AI-t,
 * nyugodtan töröld ezt a fájlt!
 * 
 * Fájlnév: TEMP_TesztKiiratas_TOROLHETO.cs
 * ============================================
 */

using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.Json;
using AdatokElerese.Models;

namespace AdatokElerese
{
    /// <summary>
    /// IDEIGLENES TESZT OSZTÁLY - TÖRÖLHETŐ!
    /// API formátumú adatok kiiratása TXT fájlba
    /// </summary>
    public static class TEMP_TesztKiiratas_TOROLHETO
    {
        private static readonly string KIMENET_MAPPA = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
            "DelibabTeszt");

        /// <summary>
        /// Az összes adat kiiratása a Desktop/DelibabTeszt mappába
        /// </summary>
        public static void MindentKiir(AdatokLekerese adatok)
        {
            // Mappa létrehozása ha nem létezik
            if (!Directory.Exists(KIMENET_MAPPA))
            {
                Directory.CreateDirectory(KIMENET_MAPPA);
            }

            string idopont = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");

            // 1. Asztalok kiiratása
            AsztalokKiiratasa(adatok, idopont);

            // 2. Időpontok és foglaltság kiiratása
            IdopontokKiiratasa(adatok, idopont);

            // 3. JSON formátumú export
            JsonExport(adatok, idopont);

            // 4. Összefoglaló
            OsszefoglaloKiiratasa(adatok, idopont);
        }

        /// <summary>
        /// Asztalok kiiratása API formátumban
        /// </summary>
        private static void AsztalokKiiratasa(AdatokLekerese adatok, string idopont)
        {
            string fajlnev = Path.Combine(KIMENET_MAPPA, $"asztalok_{idopont}.txt");
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("===========================================");
            sb.AppendLine("ASZTALOK - API FORMÁTUM");
            sb.AppendLine($"Generálva: {DateTime.Now}");
            sb.AppendLine("===========================================");
            sb.AppendLine();
            sb.AppendLine("Endpoint: POST /api/asztalok");
            sb.AppendLine("Content-Type: application/json");
            sb.AppendLine();
            sb.AppendLine("-------------------------------------------");

            for (int i = 0; i < adatok.asztalKapacitasok.Count; i++)
            {
                sb.AppendLine();
                sb.AppendLine($"--- Asztal {i + 1} ---");
                sb.AppendLine($"JSON Body:");
                sb.AppendLine("{");
                sb.AppendLine($"  \"helyek_szama\": {adatok.asztalKapacitasok[i]},");
                sb.AppendLine($"  \"asztal_allapot_id\": 1");
                sb.AppendLine("}");
            }

            sb.AppendLine();
            sb.AppendLine("===========================================");
            sb.AppendLine($"Összesen: {adatok.asztalKapacitasok.Count} asztal");
            sb.AppendLine("===========================================");

            File.WriteAllText(fajlnev, sb.ToString(), Encoding.UTF8);
        }

        /// <summary>
        /// Időpontok és foglaltság kiiratása
        /// </summary>
        private static void IdopontokKiiratasa(AdatokLekerese adatok, string idopont)
        {
            string fajlnev = Path.Combine(KIMENET_MAPPA, $"idopontok_es_foglaltsag_{idopont}.txt");
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("===========================================");
            sb.AppendLine("IDŐPONTOK ÉS FOGLALTSÁG");
            sb.AppendLine($"Generálva: {DateTime.Now}");
            sb.AppendLine("===========================================");
            sb.AppendLine();

            sb.AppendLine("IDŐPONT TÁBLÁZAT:");
            sb.AppendLine("-------------------------------------------");
            
            // Fejléc
            sb.Append("Időpont".PadRight(15));
            for (int i = 0; i < adatok.asztalKapacitasok.Count; i++)
            {
                sb.Append($"Asztal{i + 1}".PadRight(10));
            }
            sb.AppendLine();
            sb.AppendLine(new string('-', 15 + adatok.asztalKapacitasok.Count * 10));

            // Sorok
            foreach (var ido in adatok.adatok)
            {
                sb.Append(ido.ido.PadRight(15));
                for (int j = 0; j < ido.asztal.Count; j++)
                {
                    string allapot = ido.asztal[j] ? "SZABAD" : "FOGLALT";
                    sb.Append(allapot.PadRight(10));
                }
                sb.AppendLine();
            }

            sb.AppendLine();
            sb.AppendLine("===========================================");
            sb.AppendLine("FOGLALÁS API FORMÁTUM:");
            sb.AppendLine("Endpoint: POST /api/foglalasok");
            sb.AppendLine("-------------------------------------------");

            // Foglalások generálása a foglalt cellákból
            int foglalasId = 1;
            foreach (var ido in adatok.adatok)
            {
                for (int j = 0; j < ido.asztal.Count; j++)
                {
                    if (!ido.asztal[j]) // Ha foglalt
                    {
                        sb.AppendLine();
                        sb.AppendLine($"--- Foglalás #{foglalasId} ---");
                        sb.AppendLine("{");
                        sb.AppendLine($"  \"user_id\": 1,");
                        sb.AppendLine($"  \"asztal_id\": {j + 1},");
                        sb.AppendLine($"  \"foglalas_datum\": \"{DateTime.Now:yyyy-MM-dd}T{ido.ido.Split('-')[0]}:00\",");
                        sb.AppendLine($"  \"etkezes_id\": 1,");
                        sb.AppendLine($"  \"megjegyzes_id\": null");
                        sb.AppendLine("}");
                        foglalasId++;
                    }
                }
            }

            sb.AppendLine();
            sb.AppendLine($"Összesen foglalt: {foglalasId - 1} db");

            File.WriteAllText(fajlnev, sb.ToString(), Encoding.UTF8);
        }

        /// <summary>
        /// JSON formátumú export
        /// </summary>
        private static void JsonExport(AdatokLekerese adatok, string idopont)
        {
            string fajlnev = Path.Combine(KIMENET_MAPPA, $"api_export_{idopont}.json");

            // Asztalok lista
            var asztalokLista = new List<object>();
            for (int i = 0; i < adatok.asztalKapacitasok.Count; i++)
            {
                asztalokLista.Add(new
                {
                    id = i + 1,
                    helyek_szama = adatok.asztalKapacitasok[i],
                    asztal_allapot_id = 1
                });
            }

            // Foglalások lista
            var foglalasokLista = new List<object>();
            int foglalasId = 1;
            foreach (var ido in adatok.adatok)
            {
                for (int j = 0; j < ido.asztal.Count; j++)
                {
                    if (!ido.asztal[j])
                    {
                        foglalasokLista.Add(new
                        {
                            id = foglalasId,
                            user_id = 1,
                            asztal_id = j + 1,
                            foglalas_datum = $"{DateTime.Now:yyyy-MM-dd}T{ido.ido.Split('-')[0]}:00",
                            etkezes_id = 1,
                            megjegyzes_id = (int?)null
                        });
                        foglalasId++;
                    }
                }
            }

            // Időpontok lista
            var idopontokLista = new List<object>();
            int idopontId = 1;
            foreach (var ido in adatok.adatok)
            {
                idopontokLista.Add(new
                {
                    idopont_id = idopontId,
                    idopont_nev = ido.ido
                });
                idopontId++;
            }

            var exportObj = new
            {
                export_datum = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                asztalok = asztalokLista,
                idopontok = idopontokLista,
                foglalasok = foglalasokLista
            };

            var options = new JsonSerializerOptions { WriteIndented = true };
            string json = JsonSerializer.Serialize(exportObj, options);
            File.WriteAllText(fajlnev, json, Encoding.UTF8);
        }

        /// <summary>
        /// Összefoglaló kiiratása
        /// </summary>
        private static void OsszefoglaloKiiratasa(AdatokLekerese adatok, string idopont)
        {
            string fajlnev = Path.Combine(KIMENET_MAPPA, $"OSSZEFOGLALO_{idopont}.txt");
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("╔═══════════════════════════════════════════╗");
            sb.AppendLine("║     DÉLIBÁB ÉTTEREM - TESZT EXPORT        ║");
            sb.AppendLine("╚═══════════════════════════════════════════╝");
            sb.AppendLine();
            sb.AppendLine($"Generálva: {DateTime.Now}");
            sb.AppendLine($"Mentve ide: {KIMENET_MAPPA}");
            sb.AppendLine();
            sb.AppendLine("═══════════════════════════════════════════");
            sb.AppendLine("STATISZTIKÁK:");
            sb.AppendLine("═══════════════════════════════════════════");
            sb.AppendLine($"  • Asztalok száma: {adatok.asztalKapacitasok.Count}");
            sb.AppendLine($"  • Időpontok száma: {adatok.adatok.Count}");
            
            int osszesHely = 0;
            foreach (var kap in adatok.asztalKapacitasok)
            {
                osszesHely += kap;
            }
            sb.AppendLine($"  • Összes férőhely: {osszesHely} fő");

            int szabadCellak = 0;
            int foglaltCellak = 0;
            foreach (var ido in adatok.adatok)
            {
                foreach (var asztal in ido.asztal)
                {
                    if (asztal) szabadCellak++;
                    else foglaltCellak++;
                }
            }
            sb.AppendLine($"  • Szabad időpont-asztal: {szabadCellak}");
            sb.AppendLine($"  • Foglalt időpont-asztal: {foglaltCellak}");
            
            double kihasznaltsag = (double)foglaltCellak / (szabadCellak + foglaltCellak) * 100;
            sb.AppendLine($"  • Kihasználtság: {kihasznaltsag:F1}%");

            sb.AppendLine();
            sb.AppendLine("═══════════════════════════════════════════");
            sb.AppendLine("ASZTAL KAPACITÁSOK:");
            sb.AppendLine("═══════════════════════════════════════════");
            for (int i = 0; i < adatok.asztalKapacitasok.Count; i++)
            {
                sb.AppendLine($"  Asztal {i + 1}: {adatok.asztalKapacitasok[i]} fő");
            }

            sb.AppendLine();
            sb.AppendLine("═══════════════════════════════════════════");
            sb.AppendLine("LÉTREHOZOTT FÁJLOK:");
            sb.AppendLine("═══════════════════════════════════════════");
            sb.AppendLine($"  1. asztalok_{idopont}.txt");
            sb.AppendLine($"  2. idopontok_es_foglaltsag_{idopont}.txt");
            sb.AppendLine($"  3. api_export_{idopont}.json");
            sb.AppendLine($"  4. OSSZEFOGLALO_{idopont}.txt (ez a fájl)");

            sb.AppendLine();
            sb.AppendLine("═══════════════════════════════════════════");
            sb.AppendLine("MEGJEGYZÉS:");
            sb.AppendLine("═══════════════════════════════════════════");
            sb.AppendLine("Ez egy ideiglenes teszt export.");
            sb.AppendLine("A fájlok a Desktop/DelibabTeszt mappában vannak.");
            sb.AppendLine();
            sb.AppendLine("A TEMP_TesztKiiratas_TOROLHETO.cs fájlt");
            sb.AppendLine("nyugodtan törölheted, ha már nem kell!");

            File.WriteAllText(fajlnev, sb.ToString(), Encoding.UTF8);
        }

        /// <summary>
        /// Egyszerű konzol kiiratás teszteléshez
        /// </summary>
        public static void KonzolraKiir(AdatokLekerese adatok)
        {
            Console.WriteLine("\n=== ASZTALOK ===");
            for (int i = 0; i < adatok.asztalKapacitasok.Count; i++)
            {
                Console.WriteLine($"Asztal {i + 1}: {adatok.asztalKapacitasok[i]} fő");
            }

            Console.WriteLine("\n=== IDŐPONTOK ===");
            foreach (var ido in adatok.adatok)
            {
                Console.Write($"{ido.ido}: ");
                for (int j = 0; j < ido.asztal.Count; j++)
                {
                    Console.Write(ido.asztal[j] ? "[S]" : "[F]");
                }
                Console.WriteLine();
            }
        }
    }
}
