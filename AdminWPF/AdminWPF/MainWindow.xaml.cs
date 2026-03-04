using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using AdminWPF.Models;
using AdminWPF.Services;
using AdminWPF.Windows;

namespace AdminWPF
{
    public partial class MainWindow : Window
    {
        private readonly HttpClient _httpClient;

        private AsztalService _asztalService;
        private IdopontService _idopontService;
        private FoglalasService _foglalasService;
        private FelhasznaloService _felhasznaloService;

        // Jelenlegi API-ból betöltött adatok
        private List<Asztal> _asztalok = new();
        private List<Idopont> _idopontok = new();
        private List<Foglalas> _foglalasok = new();
        private List<Felhasznalo> _felhasznalok = new();

        // Rácsban lévő cellák változásai (foglalás ki/be)
        // kulcs = "asztalId_idopontId"
        private readonly Dictionary<string, RacsCella> _cellaValtozasok = new();

        // Összes függőben lévő művelet (asztal/időpont hozzáadás/törlés)
        private readonly List<FuggoBenMuvelet> _fuggoBenMuveletek = new();

        // Lokálisan hozzáadott (még nem mentett) asztalok/időpontok – a rács megjelenítéséhez
        private readonly List<Asztal> _lokalisAsztalok = new();
        private readonly List<Idopont> _lokalisIdopontok = new();

        // Lokálisan törölt (még nem mentett) asztal/időpont id-k
        private readonly HashSet<int> _torolniValoAsztalIds = new();
        private readonly HashSet<int> _torolniValoIdopontIds = new();

        private int _lokalisAsztalSorszam = -1; // negatív = lokális (még nincs DB id)
        private int _lokalisIdopontSorszam = -1;

        public MainWindow(HttpClient httpClient)
        {
            _httpClient = httpClient;
            InitializeComponent();
            _asztalService = new AsztalService(_httpClient);
            _idopontService = new IdopontService(_httpClient);
            _foglalasService = new FoglalasService(_httpClient);
            _felhasznaloService = new FelhasznaloService(_httpClient);
            Loaded += async (_, _) => await AdatokBetoltese();
        }

        // ─────────────────────────────────────────────
        //  ADATOK BETÖLTÉSE API-BÓL
        // ─────────────────────────────────────────────
        private async Task AdatokBetoltese()
        {
            labelStatus.Content = "Betöltés...";
            btnMentes.IsEnabled = false;
            btnFrissites.IsEnabled = false;

            try
            {
                _asztalok = await _asztalService.GetAsztalokAsync();
                _idopontok = (await _idopontService.GetIdopontokAsync())
                                    .OrderBy(i => i.Kezdet).ToList();
                _foglalasok = await _foglalasService.GetFoglalasokAsync();
                _felhasznalok = await _felhasznaloService.GetFelhasznalokAsync();

                // A foglalasiadatok.id-t (FoglalasiAdatokId) is betöltjük,
                // mert a törléshez kell – a backend nem adja vissza join-ban
                var foglalasiAdatokLista = await _foglalasService.GetFoglalasiAdatokAsync();
                foreach (var f in _foglalasok)
                {
                    var adat = foglalasiAdatokLista.FirstOrDefault(a => a.FoglalasId == f.Id);
                    if (adat != null)
                    {
                        f.FoglalasiAdatokId = adat.Id;
                        if (f.Felnott == null) f.Felnott = adat.Felnott;
                        if (f.Gyerek == null) f.Gyerek = adat.Gyerek;
                        if (f.Megjegyzes == null) f.Megjegyzes = adat.Megjegyzes;
                    }
                }

                // Lokális pending lista törlése – friss adatok vannak
                _cellaValtozasok.Clear();
                _fuggoBenMuveletek.Clear();
                _lokalisAsztalok.Clear();
                _lokalisIdopontok.Clear();
                _torolniValoAsztalIds.Clear();
                _torolniValoIdopontIds.Clear();
                _lokalisAsztalSorszam = -1;
                _lokalisIdopontSorszam = -1;

                RacsEpitese();
                StatusFrissites();
            }
            catch (Exception ex)
            {
                labelStatus.Content = "Hiba a betöltéskor!";
                MessageBox.Show(
                    $"Nem sikerült az adatokat betölteni!\n\nURL: {_httpClient.BaseAddress}\n\nHiba: {ex.Message}",
                    "Betöltési hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                btnMentes.IsEnabled = true;
                btnFrissites.IsEnabled = true;
            }
        }

        // ─────────────────────────────────────────────
        //  MEGJELENÍTENDŐ LISTÁK (API + lokális módosítások)
        // ─────────────────────────────────────────────
        private List<Asztal> MegjelenithitoAsztalok()
        {
            var lista = _asztalok
                .Where(a => !_torolniValoAsztalIds.Contains(a.Id))
                .ToList();
            lista.AddRange(_lokalisAsztalok);
            return lista;
        }

        private List<Idopont> MegjelenithitoIdopontok()
        {
            var lista = _idopontok
                .Where(i => !_torolniValoIdopontIds.Contains(i.Id))
                .ToList();
            lista.AddRange(_lokalisIdopontok);
            return lista;
        }

        // ─────────────────────────────────────────────
        //  RÁCS ÉPÍTÉSE
        // ─────────────────────────────────────────────
        private void RacsEpitese()
        {
            gridFoglalas.Children.Clear();
            gridFoglalas.ColumnDefinitions.Clear();
            gridFoglalas.RowDefinitions.Clear();

            var asztalok = MegjelenithitoAsztalok();
            var idopontok = MegjelenithitoIdopontok();

            if (asztalok.Count == 0 || idopontok.Count == 0)
            {
                gridFoglalas.Children.Add(new TextBlock
                {
                    Text = $"Nincs megjeleníthető adat.\n" +
                           $"Asztalok: {asztalok.Count}  |  Időpontok: {idopontok.Count}\n" +
                           $"Adjon hozzá asztalokat és időpontokat!",
                    FontFamily = new FontFamily("Segoe UI"),
                    FontSize = 13,
                    Foreground = Brushes.Gray,
                    TextAlignment = System.Windows.TextAlignment.Center,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    VerticalAlignment = VerticalAlignment.Center,
                    Margin = new Thickness(20)
                });
                return;
            }

            gridFoglalas.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(110) });
            foreach (var _ in asztalok)
                gridFoglalas.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(130) });

            gridFoglalas.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            foreach (var _ in idopontok)
                gridFoglalas.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

            AddFejlecCella(0, 0, "Időpont \\ Asztal");

            for (int a = 0; a < asztalok.Count; a++)
            {
                string fejlec = asztalok[a].Id < 0
                    ? $"⏳ Új asztal\n({asztalok[a].HelyekSzama} fő)"
                    : $"Asztal #{asztalok[a].Id}\n({asztalok[a].HelyekSzama} fő)";
                AddFejlecCella(0, a + 1, fejlec, asztalok[a].Id < 0);
            }

            for (int i = 0; i < idopontok.Count; i++)
            {
                var idopont = idopontok[i];
                int sor = i + 1;

                bool lokalisIdopont = idopont.Id < 0;
                AddFejlecCella(sor, 0, idopont.ToString(), lokalisIdopont);

                for (int a = 0; a < asztalok.Count; a++)
                {
                    var asztal = asztalok[a];
                    string kulcs = $"{asztal.Id}_{idopont.Id}";

                    RacsCella cellaAdat;
                    if (_cellaValtozasok.TryGetValue(kulcs, out var valtozas))
                    {
                        cellaAdat = valtozas;
                    }
                    else
                    {
                        var meglevo = _foglalasok.FirstOrDefault(f =>
                            f.AsztalId == asztal.Id && f.IdopontId == idopont.Id);

                        cellaAdat = new RacsCella
                        {
                            AsztalId = asztal.Id,
                            IdopontId = idopont.Id,
                            IdopontKezdet = idopont.Kezdet,
                            Foglalt = meglevo != null,
                            FoglalasId = meglevo?.Id,
                            FoglalasiAdatokId = meglevo?.FoglalasiAdatokId,
                            FelhasznaloId = meglevo?.FelhasznaloId ?? 1,
                            Megjegyzes = meglevo?.Megjegyzes ?? "",
                            Felnott = meglevo?.Felnott ?? 0,
                            Gyerek = meglevo?.Gyerek ?? 0,
                        };
                    }

                    // Lokális asztal/időpont cellái nem kattinthatók (még nincsen DB id)
                    bool kattinthato = asztal.Id > 0 && idopont.Id > 0;

                    var cella = CellaLetrehozas(cellaAdat, kattinthato);
                    Grid.SetRow(cella, sor);
                    Grid.SetColumn(cella, a + 1);
                    gridFoglalas.Children.Add(cella);
                }
            }
        }

        // ─────────────────────────────────────────────
        //  CELLA LÉTREHOZÁS
        // ─────────────────────────────────────────────
        private Border CellaLetrehozas(RacsCella cellaAdat, bool kattinthato = true)
        {
            var panel = new StackPanel
            {
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
                Margin = new Thickness(0, 6, 0, 6)
            };

            panel.Children.Add(new TextBlock
            {
                Text = cellaAdat.Foglalt ? "●" : "○",
                Foreground = Brushes.White,
                FontSize = 14,
                HorizontalAlignment = HorizontalAlignment.Center
            });

            if (cellaAdat.Foglalt)
            {
                panel.Children.Add(new TextBlock
                {
                    Text = $"👤 {cellaAdat.FelhasznaloId}",
                    Foreground = Brushes.White,
                    FontSize = 9,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    Margin = new Thickness(0, 2, 0, 0)
                });
                panel.Children.Add(new TextBlock
                {
                    Text = $"Felnőtt: {cellaAdat.Felnott}  Gyerek: {cellaAdat.Gyerek}",
                    Foreground = Brushes.White,
                    FontSize = 9,
                    HorizontalAlignment = HorizontalAlignment.Center
                });
                if (!string.IsNullOrWhiteSpace(cellaAdat.Megjegyzes))
                {
                    panel.Children.Add(new TextBlock
                    {
                        Text = cellaAdat.Megjegyzes.Length > 15
                                                ? cellaAdat.Megjegyzes[..15] + "…"
                                                : cellaAdat.Megjegyzes,
                        Foreground = new SolidColorBrush(Color.FromRgb(220, 240, 220)),
                        FontSize = 8,
                        HorizontalAlignment = HorizontalAlignment.Center,
                        TextWrapping = TextWrapping.Wrap
                    });
                }
            }

            SolidColorBrush hatter = !kattinthato
                ? new SolidColorBrush(Color.FromRgb(150, 150, 150))
                : FoglaltSzin(cellaAdat.Foglalt);

            var cella = new Border
            {
                Background = hatter,
                Margin = new Thickness(1),
                Cursor = kattinthato ? Cursors.Hand : Cursors.Arrow,
                Tag = cellaAdat,
                Child = panel
            };

            if (kattinthato)
                cella.MouseLeftButtonUp += Cella_Kattintas;

            return cella;
        }

        private void CellaFrissites(Border cella, RacsCella adat)
        {
            cella.Background = FoglaltSzin(adat.Foglalt);

            var panel = new StackPanel
            {
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
                Margin = new Thickness(0, 6, 0, 6)
            };

            panel.Children.Add(new TextBlock
            {
                Text = adat.Foglalt ? "●" : "○",
                Foreground = Brushes.White,
                FontSize = 14,
                HorizontalAlignment = HorizontalAlignment.Center
            });

            if (adat.Foglalt)
            {
                panel.Children.Add(new TextBlock
                {
                    Text = $"👤 {adat.FelhasznaloId}",
                    Foreground = Brushes.White,
                    FontSize = 9,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    Margin = new Thickness(0, 2, 0, 0)
                });
                panel.Children.Add(new TextBlock
                {
                    Text = $"Felnőtt: {adat.Felnott}  Gyerek: {adat.Gyerek}",
                    Foreground = Brushes.White,
                    FontSize = 9,
                    HorizontalAlignment = HorizontalAlignment.Center
                });
                if (!string.IsNullOrWhiteSpace(adat.Megjegyzes))
                {
                    panel.Children.Add(new TextBlock
                    {
                        Text = adat.Megjegyzes.Length > 15
                                                ? adat.Megjegyzes[..15] + "…"
                                                : adat.Megjegyzes,
                        Foreground = new SolidColorBrush(Color.FromRgb(220, 240, 220)),
                        FontSize = 8,
                        HorizontalAlignment = HorizontalAlignment.Center,
                        TextWrapping = TextWrapping.Wrap
                    });
                }
            }

            cella.Child = panel;
        }

        private void AddFejlecCella(int sor, int oszlop, string szoveg, bool lokalis = false)
        {
            var bg = lokalis
                ? new SolidColorBrush(Color.FromRgb(120, 100, 20))  // sötét sárga = nem mentett
                : new SolidColorBrush(Color.FromRgb(45, 45, 48));

            var border = new Border { Background = bg, Margin = new Thickness(1) };
            border.Child = new TextBlock
            {
                Text = szoveg,
                Foreground = Brushes.White,
                FontFamily = new FontFamily("Segoe UI"),
                FontSize = 9,
                FontWeight = FontWeights.Bold,
                TextAlignment = System.Windows.TextAlignment.Center,
                HorizontalAlignment = HorizontalAlignment.Center,
                Margin = new Thickness(6, 8, 6, 8)
            };
            Grid.SetRow(border, sor);
            Grid.SetColumn(border, oszlop);
            gridFoglalas.Children.Add(border);
        }

        private static SolidColorBrush FoglaltSzin(bool foglalt) =>
            foglalt
                ? new SolidColorBrush(Color.FromRgb(220, 53, 69))
                : new SolidColorBrush(Color.FromRgb(40, 167, 69));

        // ─────────────────────────────────────────────
        //  CELLA KATTINTÁS
        // ─────────────────────────────────────────────
        private void Cella_Kattintas(object sender, MouseButtonEventArgs e)
        {
            if (sender is not Border cella || cella.Tag is not RacsCella adat) return;

            string kulcs = $"{adat.AsztalId}_{adat.IdopontId}";

            if (!adat.Foglalt)
            {
                // SZABAD → FOGLALT: felugró ablak, asztal és időpont info átadásával
                var asztal = MegjelenithitoAsztalok().FirstOrDefault(a => a.Id == adat.AsztalId);
                var idopont = MegjelenithitoIdopontok().FirstOrDefault(i => i.Id == adat.IdopontId);

                string asztalInfo = asztal != null ? $"#{asztal.Id}  ({asztal.HelyekSzama} fő)" : $"#{adat.AsztalId}";
                string idopontInfo = idopont != null ? idopont.ToString() : $"#{adat.IdopontId}";

                var ablak = new FoglalasAdatokWindow(adat.AsztalId, asztalInfo, idopontInfo, _felhasznalok, asztal?.HelyekSzama ?? 99) { Owner = this };
                bool? eredmeny = ablak.ShowDialog();
                if (eredmeny != true) return;

                adat.Foglalt = true;
                adat.FelhasznaloId = ablak.FelhasznaloId;
                adat.Felnott = ablak.Felnott;
                adat.Gyerek = ablak.Gyerek;
                adat.Megjegyzes = ablak.Megjegyzes;
            }
            else
            {
                // FOGLALT → SZABAD
                adat.Foglalt = false;
                adat.FelhasznaloId = 1;
                adat.Felnott = 0;
                adat.Gyerek = 0;
                adat.Megjegyzes = "";
            }

            // Tag frissítése is (hogy következő kattintás helyes állapotot lásson)
            cella.Tag = adat;

            CellaFrissites(cella, adat);

            // Változás tárolása a pending dict-be
            _cellaValtozasok[kulcs] = new RacsCella
            {
                AsztalId = adat.AsztalId,
                IdopontId = adat.IdopontId,
                IdopontKezdet = adat.IdopontKezdet,
                Foglalt = adat.Foglalt,
                FoglalasId = adat.FoglalasId,
                FoglalasiAdatokId = adat.FoglalasiAdatokId,
                FelhasznaloId = adat.FelhasznaloId,
                Felnott = adat.Felnott,
                Gyerek = adat.Gyerek,
                Megjegyzes = adat.Megjegyzes
            };

            StatusFrissites();
        }

        // ─────────────────────────────────────────────
        //  STATUS BAR
        // ─────────────────────────────────────────────
        private void StatusFrissites()
        {
            int osszesFuggo = _fuggoBenMuveletek.Count + _cellaValtozasok.Count;

            if (osszesFuggo > 0)
            {
                txtBadgeSzam.Text = osszesFuggo.ToString();
                badgeValtozas.Visibility = Visibility.Visible;
                labelStatus.Content = "Nem mentett változások vannak!";
            }
            else
            {
                badgeValtozas.Visibility = Visibility.Collapsed;
                labelStatus.Content = $"Betöltve – {_asztalok.Count} asztal, {_idopontok.Count} időpont, {_foglalasok.Count} foglalás";
            }
        }

        // ─────────────────────────────────────────────
        //  MENTÉS GOMB – minden változás elküldése API-nak
        // ─────────────────────────────────────────────
        private async void BtnMentes_Click(object sender, RoutedEventArgs e)
        {
            int osszesFuggo = _fuggoBenMuveletek.Count + _cellaValtozasok.Count;

            if (osszesFuggo == 0)
            {
                MessageBox.Show("Nincs mentendő változás.", "Mentés",
                    MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            // Összefoglalás a megerősítő ablakhoz
            var osszefoglalo = new System.Text.StringBuilder();
            osszefoglalo.AppendLine($"Az alábbi {osszesFuggo} változás lesz elküldve az API-nak:\n");

            foreach (var m in _fuggoBenMuveletek)
                osszefoglalo.AppendLine($"  • {m.Leiras}");

            foreach (var cv in _cellaValtozasok.Values)
                osszefoglalo.AppendLine(cv.Foglalt
                    ? $"  • + Foglalás: Asztal #{cv.AsztalId} / Időpont #{cv.IdopontId}"
                    : $"  • - Foglalás törlése: Asztal #{cv.AsztalId} / Időpont #{cv.IdopontId}");

            osszefoglalo.AppendLine("\nBiztosan menti?");

            var megerosit = MessageBox.Show(
                osszefoglalo.ToString(),
                "Mentés megerősítése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (megerosit != MessageBoxResult.Yes) return;

            btnMentes.IsEnabled = false;
            btnFrissites.IsEnabled = false;
            labelStatus.Content = "Mentés folyamatban...";

            int sikeres = 0, sikertelen = 0;
            var hibaUzenetek = new List<string>();

            // 1a. Kapcsolódó foglalások törlése ELŐSZÖR (asztal/időpont törlés előtt)
            foreach (var muvelet in _fuggoBenMuveletek.Where(m => m.Tipus == MuveletTipus.FoglalasTöröl))
            {
                try
                {
                    string? hiba = await _foglalasService.DeleteFoglalasAsync(
                        muvelet.FoglalasId!.Value, muvelet.FoglalasiAdatokId);
                    if (hiba == null) sikeres++; else { sikertelen++; hibaUzenetek.Add(hiba); }
                }
                catch (Exception ex) { sikertelen++; hibaUzenetek.Add(ex.Message); }
            }

            // 1b. Asztal/időpont műveletek
            foreach (var muvelet in _fuggoBenMuveletek.Where(m => m.Tipus != MuveletTipus.FoglalasTöröl))
            {
                try
                {
                    bool ok = false;
                    switch (muvelet.Tipus)
                    {
                        case MuveletTipus.AsztalLetrehoz:
                            ok = await _asztalService.CreateAsztalAsync(muvelet.UjAsztal!);
                            break;
                        case MuveletTipus.AsztalTorol:
                            ok = await _asztalService.DeleteAsztalAsync(muvelet.AsztalId!.Value);
                            break;
                        case MuveletTipus.IdopontLetrehoz:
                            ok = await _idopontService.CreateIdopontAsync(muvelet.UjIdopont!);
                            if (!ok) hibaUzenetek.Add($"Időpont létrehozás sikertelen – lehet hogy már létezik ez a kezdet/vég érték");
                            break;
                        case MuveletTipus.IdopontTorol:
                            ok = await _idopontService.DeleteIdopontAsync(muvelet.IdopontId!.Value);
                            break;
                    }
                    if (ok) sikeres++; else sikertelen++;
                }
                catch (Exception ex) { sikertelen++; hibaUzenetek.Add(ex.Message); }
            }

            // 2. Cella változások (foglalás létre/törlés)
            foreach (var v in _cellaValtozasok.Values)
            {
                try
                {
                    if (v.Foglalt)
                    {
                        // Foglalás + foglalasiAdatok egyszerre
                        // Jövőbeli dátum generálása az időpont kezdetéből
                        // IdopontKezdet pl. 10.5 = 10:30, 14.0 = 14:00
                        int ora = (int)v.IdopontKezdet;
                        int perc = (int)Math.Round((v.IdopontKezdet - ora) * 60);
                        string foglaiasDatum = DateTime.Today.AddDays(1)
                            .AddHours(ora).AddMinutes(perc)
                            .ToString("yyyy-MM-dd HH:mm:ss");

                        var ujFoglalas = new FoglalasLetrehozas
                        {
                            FelhasznaloId = v.FelhasznaloId,
                            AsztalId = v.AsztalId,
                            IdopontId = v.IdopontId,
                            FoglaiasDatum = foglaiasDatum
                        };
                        var ujAdatok = new FoglalasiadatokLetrehozas
                        {
                            Felnott = v.Felnott,
                            Gyerek = v.Gyerek,
                            Megjegyzes = v.Megjegyzes
                        };
                        string? hiba = await _foglalasService.CreateFoglalasAsync(ujFoglalas, ujAdatok);
                        if (hiba == null)
                            sikeres++;
                        else
                        {
                            sikertelen++;
                            hibaUzenetek.Add($"Asztal #{v.AsztalId} / Időpont #{v.IdopontId}: {hiba}");
                        }
                    }
                    else
                    {
                        if (v.FoglalasId.HasValue)
                        {
                            string? hiba = await _foglalasService.DeleteFoglalasAsync(v.FoglalasId.Value, v.FoglalasiAdatokId);
                            if (hiba == null)
                                sikeres++;
                            else
                            {
                                sikertelen++;
                                hibaUzenetek.Add($"Törlés #{v.FoglalasId}: {hiba}");
                            }
                        }
                        else
                        {
                            sikeres++;
                        }
                    }
                }
                catch (Exception ex) { sikertelen++; hibaUzenetek.Add(ex.Message); }
            }

            // Friss adatok betöltése API-ból
            await AdatokBetoltese();

            btnMentes.IsEnabled = true;
            btnFrissites.IsEnabled = true;
            labelStatus.Content = $"Mentve – {sikeres} sikeres, {sikertelen} sikertelen";

            string eredmenyUzenet = $"Mentés kész!\n✅ Sikeres: {sikeres}  |  ❌ Sikertelen: {sikertelen}";
            if (hibaUzenetek.Count > 0)
                eredmenyUzenet += "\n\nHibák:\n" + string.Join("\n", hibaUzenetek);

            MessageBox.Show(
                eredmenyUzenet,
                "Mentés eredménye",
                MessageBoxButton.OK,
                sikertelen > 0 ? MessageBoxImage.Warning : MessageBoxImage.Information);
        }

        // ─────────────────────────────────────────────
        //  FRISSÍTÉS API-BÓL
        // ─────────────────────────────────────────────
        private async void BtnFrissites_Click(object sender, RoutedEventArgs e)
        {
            int osszesFuggo = _fuggoBenMuveletek.Count + _cellaValtozasok.Count;

            string szoveg = osszesFuggo > 0
                ? $"Van {osszesFuggo} mentetlen változás!\n\nBiztosan frissít az API-ból? A nem mentett módosítások elvesznek!"
                : "Biztosan frissíti az adatokat az API-ból?";

            var megerosit = MessageBox.Show(
                szoveg,
                "Frissítés megerősítése",
                MessageBoxButton.YesNo,
                osszesFuggo > 0 ? MessageBoxImage.Warning : MessageBoxImage.Question);

            if (megerosit != MessageBoxResult.Yes) return;

            await AdatokBetoltese();
        }

        // ─────────────────────────────────────────────
        //  ASZTAL KEZELÉS – lokális queue, NEM hív API-t azonnal
        // ─────────────────────────────────────────────
        private void BtnAsztalHozzaad_Click(object sender, RoutedEventArgs e)
        {
            var ablak = new AsztalLetrehozasWindow { Owner = this };
            if (ablak.ShowDialog() != true || ablak.Eredmeny == null) return;

            // Lokális ideiglenes asztal (negatív ID = még nincs mentve)
            var lokalisAsztal = new Asztal
            {
                Id = _lokalisAsztalSorszam--,
                HelyekSzama = ablak.Eredmeny.HelyekSzama
            };
            _lokalisAsztalok.Add(lokalisAsztal);

            _fuggoBenMuveletek.Add(new FuggoBenMuvelet
            {
                Tipus = MuveletTipus.AsztalLetrehoz,
                UjAsztal = ablak.Eredmeny
            });

            RacsEpitese();
            StatusFrissites();
        }

        private void BtnAsztalTorol_Click(object sender, RoutedEventArgs e)
        {
            var jelenlegiAsztalok = MegjelenithitoAsztalok();
            if (jelenlegiAsztalok.Count == 0)
            {
                MessageBox.Show("Nincs törölhető asztal!", "Figyelem", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var ablak = new AsztalTorlasWindow(jelenlegiAsztalok) { Owner = this };
            if (ablak.ShowDialog() != true || ablak.KivalasztottAsztal == null) return;

            var kivalasztott = ablak.KivalasztottAsztal;

            if (kivalasztott.Id < 0)
            {
                // Lokális (nem mentett) asztal – csak a listából vesszük ki
                _lokalisAsztalok.RemoveAll(a => a.Id == kivalasztott.Id);
                // Kapcsolódó pending létrehozás törlése is
                _fuggoBenMuveletek.RemoveAll(m =>
                    m.Tipus == MuveletTipus.AsztalLetrehoz &&
                    m.UjAsztal?.HelyekSzama == kivalasztott.HelyekSzama);
            }
            else
            {
                // API-ból betöltött asztal – queue-ba kerül
                // A kapcsolódó foglalásokat is törölni kell előbb
                var kapcsolodoFoglalasok = _foglalasok.Where(f => f.AsztalId == kivalasztott.Id).ToList();
                if (kapcsolodoFoglalasok.Count > 0)
                {
                    var megerosit = MessageBox.Show(
                        $"Az asztalhoz {kapcsolodoFoglalasok.Count} foglalás tartozik!\nEzek is törlődnek. Folytatja?",
                        "Figyelem", MessageBoxButton.YesNo, MessageBoxImage.Warning);
                    if (megerosit != MessageBoxResult.Yes) return;

                    foreach (var f in kapcsolodoFoglalasok)
                    {
                        _fuggoBenMuveletek.Add(new FuggoBenMuvelet
                        {
                            Tipus = MuveletTipus.FoglalasTöröl,
                            FoglalasId = f.Id,
                            FoglalasiAdatokId = f.FoglalasiAdatokId
                        });
                    }
                }

                _torolniValoAsztalIds.Add(kivalasztott.Id);
                _fuggoBenMuveletek.Add(new FuggoBenMuvelet
                {
                    Tipus = MuveletTipus.AsztalTorol,
                    AsztalId = kivalasztott.Id
                });
            }

            RacsEpitese();
            StatusFrissites();
        }

        // ─────────────────────────────────────────────
        //  IDŐPONT KEZELÉS – lokális queue, NEM hív API-t azonnal
        // ─────────────────────────────────────────────
        private void BtnIdopontHozzaad_Click(object sender, RoutedEventArgs e)
        {
            var ablak = new IdopontLetrehozasWindow(MegjelenithitoIdopontok()) { Owner = this };
            if (ablak.ShowDialog() != true || ablak.Eredmeny == null) return;

            var lokalisIdopont = new Idopont
            {
                Id = _lokalisIdopontSorszam--,
                Kezdet = ablak.Eredmeny.Kezdet,
                Veg = ablak.Eredmeny.Veg
            };
            _lokalisIdopontok.Add(lokalisIdopont);

            _fuggoBenMuveletek.Add(new FuggoBenMuvelet
            {
                Tipus = MuveletTipus.IdopontLetrehoz,
                UjIdopont = ablak.Eredmeny
            });

            RacsEpitese();
            StatusFrissites();
        }

        private void BtnIdopontTorol_Click(object sender, RoutedEventArgs e)
        {
            var jelenlegiIdopontok = MegjelenithitoIdopontok();
            if (jelenlegiIdopontok.Count == 0)
            {
                MessageBox.Show("Nincs törölhető időpont!", "Figyelem", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var ablak = new IdopontTorlasWindow(jelenlegiIdopontok) { Owner = this };
            if (ablak.ShowDialog() != true || ablak.KivalasztottIdopont == null) return;

            var kivalasztott = ablak.KivalasztottIdopont;

            if (kivalasztott.Id < 0)
            {
                _lokalisIdopontok.RemoveAll(i => i.Id == kivalasztott.Id);
                _fuggoBenMuveletek.RemoveAll(m =>
                    m.Tipus == MuveletTipus.IdopontLetrehoz &&
                    m.UjIdopont?.Kezdet == kivalasztott.Kezdet &&
                    m.UjIdopont?.Veg == kivalasztott.Veg);
            }
            else
            {
                // A kapcsolódó foglalásokat is törölni kell előbb
                var kapcsolodoFoglalasok = _foglalasok.Where(f => f.IdopontId == kivalasztott.Id).ToList();
                if (kapcsolodoFoglalasok.Count > 0)
                {
                    var megerosit = MessageBox.Show(
                        $"Az időponthoz {kapcsolodoFoglalasok.Count} foglalás tartozik!\nEzek is törlődnek. Folytatja?",
                        "Figyelem", MessageBoxButton.YesNo, MessageBoxImage.Warning);
                    if (megerosit != MessageBoxResult.Yes) return;

                    foreach (var f in kapcsolodoFoglalasok)
                    {
                        _fuggoBenMuveletek.Add(new FuggoBenMuvelet
                        {
                            Tipus = MuveletTipus.FoglalasTöröl,
                            FoglalasId = f.Id,
                            FoglalasiAdatokId = f.FoglalasiAdatokId
                        });
                    }
                }

                _torolniValoIdopontIds.Add(kivalasztott.Id);
                _fuggoBenMuveletek.Add(new FuggoBenMuvelet
                {
                    Tipus = MuveletTipus.IdopontTorol,
                    IdopontId = kivalasztott.Id
                });
            }

            RacsEpitese();
            StatusFrissites();
        }
    }
}
