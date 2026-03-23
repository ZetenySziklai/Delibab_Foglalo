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

        // A bejelentkezett admin ID-ja. Erre azért van szükség, mert ezt a felhasználót
        // nem szabad törölni és nem lehet elvenni tőle az admin jogot.
        private readonly int _bejelentkezettAdminId;

        private readonly AsztalService _asztalService;
        private readonly IdopontService _idopontService;
        private readonly FoglalasService _foglalasService;
        private readonly FelhasznaloService _felhasznaloService;

        // Az API-ból betöltött alaplista – ezek az adatbázisban lévő valós adatok.
        private List<Asztal> _asztalok = new();
        private List<Idopont> _idopontok = new();
        private List<Foglalas> _foglalasok = new();
        private List<Felhasznalo> _felhasznalok = new();

        // Nyilvántartja a rácson elvégzett, de még nem mentett foglalási változásokat.
        // Kulcs: "asztalId_idopontId" – így bármelyik cella állapota gyorsan visszakereshető.
        private readonly Dictionary<string, RacsCella> _cellaValtozasok = new();

        // Asztal/időpont hozzáadás és törlés műveletek, amelyek mentésre várnak.
        // Ezeket a mentés gomb dolgozza fel sorban.
        private readonly List<FuggoBenMuvelet> _fuggoBenMuveletek = new();

        // Lokálisan felvett, de az adatbázisban még nem szereplő asztalok/időpontok.
        // Negatív ID-val jelennek meg a rácson, hogy megkülönböztethetők legyenek.
        private readonly List<Asztal> _lokalisAsztalok = new();
        private readonly List<Idopont> _lokalisIdopontok = new();

        // Törlésre jelölt asztal/időpont ID-k. Ezek már nem jelennek meg a rácson,
        // de az adatbázisból csak mentéskor törlődnek.
        private readonly HashSet<int> _torolniValoAsztalIds = new();
        private readonly HashSet<int> _torolniValoIdopontIds = new();

        private int _lokalisAsztalSorszam = -1;
        private int _lokalisIdopontSorszam = -1;

        // A rácson éppen megjelenített nap. Alapértelmezetten holnap, mert mára már
        // általában nem lehet foglalni.
        private DateTime _kivalasztottDatum = DateTime.Today.AddDays(1);

        public MainWindow(HttpClient httpClient, int bejelentkezettAdminId)
        {
            _httpClient = httpClient;
            _bejelentkezettAdminId = bejelentkezettAdminId;
            InitializeComponent();
            _asztalService = new AsztalService(_httpClient);
            _idopontService = new IdopontService(_httpClient);
            _foglalasService = new FoglalasService(_httpClient);
            _felhasznaloService = new FelhasznaloService(_httpClient);

            Loaded += async (_, _) =>
            {
                DatumComboBoxFeltoltes();
                await AdatokBetoltese();
            };
        }

        private void DatumComboBoxFeltoltes()
        {
            var hun = new System.Globalization.CultureInfo("hu-HU");
            DateTime holnap = DateTime.Today.AddDays(1);

            for (int i = 0; i < 30; i++)
                cmbDatum.Items.Add(holnap.AddDays(i).ToString("yyyy. MM. dd. (ddd)", hun));

            cmbDatum.SelectedIndex = 0;
            _kivalasztottDatum = holnap;
        }

        private void CmbDatum_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (cmbDatum.SelectedIndex < 0) return;
            _kivalasztottDatum = DateTime.Today.AddDays(1 + cmbDatum.SelectedIndex);
            RacsEpitese();
        }

        private async Task AdatokBetoltese()
        {
            labelStatus.Content = "Betöltés...";
            btnMentes.IsEnabled = false;
            btnFrissites.IsEnabled = false;

            try
            {
                _asztalok = await _asztalService.GetAsztalokAsync();
                _idopontok = (await _idopontService.GetIdopontokAsync()).OrderBy(i => i.Kezdet).ToList();
                _foglalasok = await _foglalasService.GetFoglalasokAsync();
                _felhasznalok = await _felhasznaloService.GetFelhasznalokAsync();

                // A foglalasiadatok táblát külön kell lekérni, mert a GET /api/foglalasok
                // végpont nem adja vissza ezeket – a join a kliens oldalon történik meg.
                var foglalasiAdatokLista = await _foglalasService.GetFoglalasiAdatokAsync();
                foreach (var f in _foglalasok)
                {
                    var adatok = foglalasiAdatokLista.FirstOrDefault(a => a.FoglalasId == f.Id);
                    if (adatok == null) continue;

                    f.FoglalasiAdatokId = adatok.Id;
                    f.FoglaltNap = adatok.FoglaiasDatum;
                    f.Felnott = adatok.Felnott;
                    f.Gyerek = adatok.Gyerek;
                    f.Megjegyzes = adatok.Megjegyzes;
                }

                AllapotVisszaallitas();
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

        // Frissítéskor minden lokális változás elvész – az adatbázis állapota lesz az igazság.
        private void AllapotVisszaallitas()
        {
            _cellaValtozasok.Clear();
            _fuggoBenMuveletek.Clear();
            _lokalisAsztalok.Clear();
            _lokalisIdopontok.Clear();
            _torolniValoAsztalIds.Clear();
            _torolniValoIdopontIds.Clear();
            _lokalisAsztalSorszam = -1;
            _lokalisIdopontSorszam = -1;
        }

        // Az API-ból betöltött lista + lokálisan hozzáadottak, a törölt elemek nélkül.
        // Ezeket a listákat használja a rács – így a mentés előtti állapotot mutatja.
        private List<Asztal> MegjelenithitoAsztalok()
        {
            var lista = _asztalok.Where(a => !_torolniValoAsztalIds.Contains(a.Id)).ToList();
            lista.AddRange(_lokalisAsztalok);
            return lista;
        }

        private List<Idopont> MegjelenithitoIdopontok()
        {
            var lista = _idopontok.Where(i => !_torolniValoIdopontIds.Contains(i.Id)).ToList();
            lista.AddRange(_lokalisIdopontok);
            return lista;
        }

        // Felépíti a foglalási rácsot a semmiből. Minden dátumváltáskor és adatmódosításkor
        // újrafut. Lokálisan hozzáadott (még nem mentett) elemek sárgás fejléccel jelennek meg.
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
                    TextAlignment = TextAlignment.Center,
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
                string szoveg = asztalok[a].Id < 0
                    ? $"⏳ Új asztal\n({asztalok[a].HelyekSzama} fő)"
                    : $"Asztal #{asztalok[a].Id}\n({asztalok[a].HelyekSzama} fő)";
                AddFejlecCella(0, a + 1, szoveg, asztalok[a].Id < 0);
            }

            for (int i = 0; i < idopontok.Count; i++)
            {
                var idopont = idopontok[i];
                int sor = i + 1;

                AddFejlecCella(sor, 0, idopont.ToString(), idopont.Id < 0);

                for (int a = 0; a < asztalok.Count; a++)
                {
                    var asztal = asztalok[a];
                    var cellaAdat = CellaAdatLekeres(asztal, idopont);
                    bool kattinthato = asztal.Id > 0 && idopont.Id > 0;

                    // Lokális asztal/időpont cellái nem kattinthatók – nincs még érvényes API ID-juk.
                    var cella = CellaLetrehozas(cellaAdat, kattinthato);
                    Grid.SetRow(cella, sor);
                    Grid.SetColumn(cella, a + 1);
                    gridFoglalas.Children.Add(cella);
                }
            }
        }

        // Megkeresi a cella aktuális állapotát. Ha a felhasználó már módosította (de még
        // nem mentette), a _cellaValtozasok-ból adja vissza. Különben az adatbázisból
        // betöltött foglalások között keres asztal + időpont + dátum alapján.
        private RacsCella CellaAdatLekeres(Asztal asztal, Idopont idopont)
        {
            string kulcs = $"{asztal.Id}_{idopont.Id}";

            if (_cellaValtozasok.TryGetValue(kulcs, out var valtozas))
                return valtozas;

            var meglevo = _foglalasok.FirstOrDefault(f =>
                f.AsztalId == asztal.Id &&
                f.IdopontId == idopont.Id &&
                f.FoglaltNap != null &&
                DateTime.TryParse(f.FoglaltNap,
                    System.Globalization.CultureInfo.InvariantCulture,
                    System.Globalization.DateTimeStyles.None,
                    out var fd) &&
                fd.Date == _kivalasztottDatum.Date);

            return new RacsCella
            {
                AsztalId = asztal.Id,
                IdopontId = idopont.Id,
                IdopontKezdet = idopont.Kezdet,
                FoglalasDatum = _kivalasztottDatum.Date,
                Foglalt = meglevo != null,
                FoglalasId = meglevo?.Id,
                FoglalasiAdatokId = meglevo?.FoglalasiAdatokId,
                FelhasznaloId = meglevo?.FelhasznaloId ?? 1,
                Megjegyzes = meglevo?.Megjegyzes ?? "",
                Felnott = meglevo?.Felnott ?? 0,
                Gyerek = meglevo?.Gyerek ?? 0,
                EredetiDmFelhasznaloId = meglevo?.FelhasznaloId ?? 0,
                EredetiFelnott = meglevo?.Felnott ?? 0,
                EredetiGyerek = meglevo?.Gyerek ?? 0,
                EredetiMegjegyzes = meglevo?.Megjegyzes ?? "",
            };
        }

        private Border CellaLetrehozas(RacsCella cellaAdat, bool kattinthato = true)
        {
            SolidColorBrush hatter = !kattinthato
                ? new SolidColorBrush(Color.FromRgb(150, 150, 150))
                : FoglaltSzin(cellaAdat.Foglalt);

            var cella = new Border
            {
                Background = hatter,
                Margin = new Thickness(1),
                Cursor = kattinthato ? Cursors.Hand : Cursors.Arrow,
                Tag = cellaAdat,
                Child = CellaTartalom(cellaAdat)
            };

            if (kattinthato)
                cella.MouseLeftButtonUp += Cella_Kattintas;

            return cella;
        }

        private void CellaFrissites(Border cella, RacsCella adat)
        {
            cella.Background = FoglaltSzin(adat.Foglalt);
            cella.Child = CellaTartalom(adat);
        }

        // Összerakja a cella vizuális tartalmát: foglalás esetén vendégszámot és megjegyzést
        // is megjelenít, szabad cella esetén csak a körjelzőt.
        private StackPanel CellaTartalom(RacsCella adat)
        {
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

            if (!adat.Foglalt) return panel;

            panel.Children.Add(new TextBlock
            {
                Text = $"👤 {adat.Felnott + adat.Gyerek} fő",
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
                string megjegyzes = adat.Megjegyzes.Length > 15
                    ? adat.Megjegyzes[..15] + "…"
                    : adat.Megjegyzes;

                panel.Children.Add(new TextBlock
                {
                    Text = megjegyzes,
                    Foreground = new SolidColorBrush(Color.FromRgb(220, 240, 220)),
                    FontSize = 8,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    TextWrapping = TextWrapping.Wrap
                });
            }

            return panel;
        }

        private void AddFejlecCella(int sor, int oszlop, string szoveg, bool lokalis = false)
        {
            var hatter = lokalis
                ? new SolidColorBrush(Color.FromRgb(120, 100, 20))
                : new SolidColorBrush(Color.FromRgb(45, 45, 48));

            var border = new Border { Background = hatter, Margin = new Thickness(1) };
            border.Child = new TextBlock
            {
                Text = szoveg,
                Foreground = Brushes.White,
                FontFamily = new FontFamily("Segoe UI"),
                FontSize = 9,
                FontWeight = FontWeights.Bold,
                TextAlignment = TextAlignment.Center,
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

        // Kezeli a rácscellára való kattintást.
        // - Szabad cellán: felugró ablak a foglalási adatokhoz, majd a cella foglaltra vált.
        // - Foglalt cellán: azonnal törlésre jelöli a foglalást.
        // Különleges eset: ha ugyanolyan felhasználóra foglalják vissza, mint aki DB-ben volt,
        // a változás visszavonódik (mintha nem történt semmi).
        private void Cella_Kattintas(object sender, MouseButtonEventArgs e)
        {
            if (sender is not Border cella || cella.Tag is not RacsCella adat) return;

            string kulcs = $"{adat.AsztalId}_{adat.IdopontId}";

            if (!adat.Foglalt)
            {
                var asztal = MegjelenithitoAsztalok().FirstOrDefault(a => a.Id == adat.AsztalId);
                var idopont = MegjelenithitoIdopontok().FirstOrDefault(i => i.Id == adat.IdopontId);

                string asztalInfo = asztal != null ? $"#{asztal.Id}  ({asztal.HelyekSzama} fő)" : $"#{adat.AsztalId}";
                string idopontInfo = idopont != null ? idopont.ToString() : $"#{adat.IdopontId}";

                var ablak = new FoglalasAdatokWindow(
                    adat.AsztalId, asztalInfo, idopontInfo, _felhasznalok, asztal?.HelyekSzama ?? 99)
                { Owner = this };

                if (ablak.ShowDialog() != true) return;

                int jelenlegiFelhasznaloId = _cellaValtozasok.TryGetValue(kulcs, out var korabbi)
                    ? korabbi.FelhasznaloId
                    : adat.EredetiDmFelhasznaloId;

                if (adat.FoglalasId.HasValue && jelenlegiFelhasznaloId == ablak.FelhasznaloId)
                {
                    // Visszaállítás: a változás törlődik, az eredeti DB-s adatok kerülnek vissza.
                    _cellaValtozasok.Remove(kulcs);
                    adat.Foglalt = true;
                    adat.FelhasznaloId = adat.EredetiDmFelhasznaloId;
                    adat.Felnott = adat.EredetiFelnott;
                    adat.Gyerek = adat.EredetiGyerek;
                    adat.Megjegyzes = adat.EredetiMegjegyzes;
                    cella.Tag = adat;
                    CellaFrissites(cella, adat);
                    StatusFrissites();
                    return;
                }

                adat.Foglalt = true;
                adat.FelhasznaloId = ablak.FelhasznaloId;
                adat.Felnott = ablak.Felnott;
                adat.Gyerek = ablak.Gyerek;
                adat.Megjegyzes = ablak.Megjegyzes;
            }
            else
            {
                adat.Foglalt = false;
                adat.FelhasznaloId = 0;  // 0 sosem egyezik valódi user ID-val, így nem okoz félreértést
                adat.Felnott = 0;
                adat.Gyerek = 0;
                adat.Megjegyzes = "";
            }

            cella.Tag = adat;
            CellaFrissites(cella, adat);
            _cellaValtozasok[kulcs] = adat;
            StatusFrissites();
        }

        // Frissíti a fejlécben lévő státuszsávot. Ha van mentetlen változás,
        // megjelenik az orange badge a darabszámmal.
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

        // Elküldi az összes függőben lévő változást az API-nak.
        // Sorrend (idegen kulcs miatt fontos):
        //   1. Foglalás törlések (előbb, mint az asztal/időpont törlése)
        //   2. Asztal és időpont műveletek
        //   3. Cella változások (új foglalás / törlés / felhasználócsere)
        private async void BtnMentes_Click(object sender, RoutedEventArgs e)
        {
            int osszesFuggo = _fuggoBenMuveletek.Count + _cellaValtozasok.Count;

            if (osszesFuggo == 0)
            {
                MessageBox.Show("Nincs mentendő változás.", "Mentés", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            var osszefoglalo = new System.Text.StringBuilder();
            osszefoglalo.AppendLine($"Az alábbi {osszesFuggo} változás lesz elküldve az API-nak:\n");

            foreach (var m in _fuggoBenMuveletek)
                osszefoglalo.AppendLine($"  • {m.Leiras}");

            foreach (var cv in _cellaValtozasok.Values)
                osszefoglalo.AppendLine(cv.Foglalt
                    ? $"  • + Foglalás: Asztal #{cv.AsztalId} / Időpont #{cv.IdopontId}"
                    : $"  • - Foglalás törlése: Asztal #{cv.AsztalId} / Időpont #{cv.IdopontId}");

            osszefoglalo.AppendLine("\nBiztosan menti?");

            var megerosit = MessageBox.Show(osszefoglalo.ToString(), "Mentés megerősítése",
                MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (megerosit != MessageBoxResult.Yes) return;

            btnMentes.IsEnabled = false;
            btnFrissites.IsEnabled = false;
            labelStatus.Content = "Mentés folyamatban...";

            int sikeres = 0, sikertelen = 0;
            var hibaUzenetek = new List<string>();

            // 1. lépés: kapcsolódó foglalások törlése, mielőtt az asztal/időpont törlődne
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

            // 2. lépés: asztal és időpont létrehozás / törlés
            foreach (var muvelet in _fuggoBenMuveletek.Where(m => m.Tipus != MuveletTipus.FoglalasTöröl))
            {
                try
                {
                    bool ok = muvelet.Tipus switch
                    {
                        MuveletTipus.AsztalLetrehoz => await _asztalService.CreateAsztalAsync(muvelet.UjAsztal!),
                        MuveletTipus.AsztalTorol => await _asztalService.DeleteAsztalAsync(muvelet.AsztalId!.Value),
                        MuveletTipus.IdopontLetrehoz => await _idopontService.CreateIdopontAsync(muvelet.UjIdopont!),
                        MuveletTipus.IdopontTorol => await _idopontService.DeleteIdopontAsync(muvelet.IdopontId!.Value),
                        _ => false
                    };

                    if (muvelet.Tipus == MuveletTipus.IdopontLetrehoz && !ok)
                        hibaUzenetek.Add("Időpont létrehozás sikertelen – lehet hogy már létezik ez a kezdet/vég érték");

                    if (ok) sikeres++; else sikertelen++;
                }
                catch (Exception ex) { sikertelen++; hibaUzenetek.Add(ex.Message); }
            }

            // 3. lépés: foglalási cella változások (új foglalás / törlés / felhasználócsere)
            foreach (var v in _cellaValtozasok.Values)
            {
                try
                {
                    if (v.Foglalt)
                    {
                        int ora = (int)v.IdopontKezdet;
                        int perc = (int)Math.Round((v.IdopontKezdet - ora) * 60);

                        // A Magyar időzóna eltolása naponta eltérhet (nyári/téli időszámítás),
                        // ezért mindig az adott napra számoljuk ki, nem fixálunk +1 vagy +2 órát.
                        var magyarTz = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
                        DateTime helyi = v.FoglalasDatum.AddHours(ora).AddMinutes(perc);
                        TimeSpan offset = magyarTz.GetUtcOffset(helyi);

                        string foglaiasDatum = helyi.Add(offset).ToString("yyyy-MM-dd HH:mm:ss");
                        TimeSpan offsetMost = magyarTz.GetUtcOffset(DateTime.Now);
                        string mentesIdeje = DateTime.Now.Add(offsetMost).ToString("yyyy-MM-dd HH:mm:ss");

                        // Felhasználócsere esetén előbb törölni kell a régi foglalást,
                        // majd létrehozni az újat (a DB nem támogat közvetlen UPDATE-et erre).
                        if (v.FoglalasId.HasValue)
                        {
                            string? torlesHiba = await _foglalasService.DeleteFoglalasAsync(v.FoglalasId.Value, v.FoglalasiAdatokId);
                            if (torlesHiba != null)
                            {
                                sikertelen++;
                                hibaUzenetek.Add($"Régi foglalás törlése sikertelen #{v.FoglalasId}: {torlesHiba}");
                                continue;
                            }
                        }

                        var ujFoglalas = new FoglalasLetrehozas
                        {
                            FelhasznaloId = v.FelhasznaloId,
                            AsztalId = v.AsztalId,
                            IdopontId = v.IdopontId,
                            FoglaiasDatum = mentesIdeje
                        };
                        var ujAdatok = new FoglalasiadatokLetrehozas
                        {
                            FoglaiasDatum = foglaiasDatum,
                            Felnott = v.Felnott,
                            Gyerek = v.Gyerek,
                            Megjegyzes = v.Megjegyzes
                        };

                        string? hiba = await _foglalasService.CreateFoglalasAsync(ujFoglalas, ujAdatok);
                        if (hiba == null) sikeres++;
                        else { sikertelen++; hibaUzenetek.Add($"Asztal #{v.AsztalId} / Időpont #{v.IdopontId}: {hiba}"); }
                    }
                    else
                    {
                        if (v.FoglalasId.HasValue)
                        {
                            string? hiba = await _foglalasService.DeleteFoglalasAsync(v.FoglalasId.Value, v.FoglalasiAdatokId);
                            if (hiba == null) sikeres++;
                            else { sikertelen++; hibaUzenetek.Add($"Törlés #{v.FoglalasId}: {hiba}"); }
                        }
                        else
                        {
                            sikeres++;
                        }
                    }
                }
                catch (Exception ex) { sikertelen++; hibaUzenetek.Add(ex.Message); }
            }

            await AdatokBetoltese();

            btnMentes.IsEnabled = true;
            btnFrissites.IsEnabled = true;
            labelStatus.Content = $"Mentve – {sikeres} sikeres, {sikertelen} sikertelen";

            string eredmenyUzenet = $"Mentés kész!\n✅ Sikeres: {sikeres}  |  ❌ Sikertelen: {sikertelen}";
            if (hibaUzenetek.Count > 0)
                eredmenyUzenet += "\n\nHibák:\n" + string.Join("\n", hibaUzenetek);

            MessageBox.Show(eredmenyUzenet, "Mentés eredménye", MessageBoxButton.OK,
                sikertelen > 0 ? MessageBoxImage.Warning : MessageBoxImage.Information);
        }

        // Ha vannak mentetlen változások, figyelmeztet mielőtt az API-ból frissítene,
        // mert a frissítés minden lokális módosítást elveszt.
        private async void BtnFrissites_Click(object sender, RoutedEventArgs e)
        {
            int osszesFuggo = _fuggoBenMuveletek.Count + _cellaValtozasok.Count;

            string szoveg = osszesFuggo > 0
                ? $"Van {osszesFuggo} mentetlen változás!\n\nBiztosan frissít az API-ból? A nem mentett módosítások elvesznek!"
                : "Biztosan frissíti az adatokat az API-ból?";

            var megerosit = MessageBox.Show(szoveg, "Frissítés megerősítése",
                MessageBoxButton.YesNo,
                osszesFuggo > 0 ? MessageBoxImage.Warning : MessageBoxImage.Question);

            if (megerosit != MessageBoxResult.Yes) return;

            await AdatokBetoltese();
        }

        // Új asztal hozzáadása: felugró ablak bekéri a helyek számát, majd lokálisan
        // eltárolja (negatív ID-val) és felveszi a függőben lévő műveletek közé.
        private void BtnAsztalHozzaad_Click(object sender, RoutedEventArgs e)
        {
            var ablak = new AsztalLetrehozasWindow { Owner = this };
            if (ablak.ShowDialog() != true || ablak.Eredmeny == null) return;

            _lokalisAsztalok.Add(new Asztal
            {
                Id = _lokalisAsztalSorszam--,
                HelyekSzama = ablak.Eredmeny.HelyekSzama
            });

            _fuggoBenMuveletek.Add(new FuggoBenMuvelet
            {
                Tipus = MuveletTipus.AsztalLetrehoz,
                UjAsztal = ablak.Eredmeny
            });

            RacsEpitese();
            StatusFrissites();
        }

        // Asztal törlése. Ha az asztalhoz foglalások tartoznak, figyelmeztetés után
        // azokat is törli. Lokális asztal esetén csak a lokális listából távolítja el.
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
                _lokalisAsztalok.RemoveAll(a => a.Id == kivalasztott.Id);
                _fuggoBenMuveletek.RemoveAll(m =>
                    m.Tipus == MuveletTipus.AsztalLetrehoz &&
                    m.UjAsztal?.HelyekSzama == kivalasztott.HelyekSzama);
            }
            else
            {
                var kapcsolodoFoglalasok = _foglalasok.Where(f => f.AsztalId == kivalasztott.Id).ToList();
                if (kapcsolodoFoglalasok.Count > 0)
                {
                    var megerosit = MessageBox.Show(
                        $"Az asztalhoz {kapcsolodoFoglalasok.Count} foglalás tartozik!\nEzek is törlődnek. Folytatja?",
                        "Figyelem", MessageBoxButton.YesNo, MessageBoxImage.Warning);
                    if (megerosit != MessageBoxResult.Yes) return;

                    foreach (var f in kapcsolodoFoglalasok)
                        _fuggoBenMuveletek.Add(new FuggoBenMuvelet
                        {
                            Tipus = MuveletTipus.FoglalasTöröl,
                            FoglalasId = f.Id,
                            FoglalasiAdatokId = f.FoglalasiAdatokId
                        });
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

        // Új időpont hozzáadása. Átadja a már meglévő időpontokat az ablaknak,
        // hogy ott lehessen ellenőrizni az ütközést.
        private void BtnIdopontHozzaad_Click(object sender, RoutedEventArgs e)
        {
            var ablak = new IdopontLetrehozasWindow(MegjelenithitoIdopontok()) { Owner = this };
            if (ablak.ShowDialog() != true || ablak.Eredmeny == null) return;

            _lokalisIdopontok.Add(new Idopont
            {
                Id = _lokalisIdopontSorszam--,
                Kezdet = ablak.Eredmeny.Kezdet,
                Veg = ablak.Eredmeny.Veg
            });

            _fuggoBenMuveletek.Add(new FuggoBenMuvelet
            {
                Tipus = MuveletTipus.IdopontLetrehoz,
                UjIdopont = ablak.Eredmeny
            });

            RacsEpitese();
            StatusFrissites();
        }

        // Időpont törlése. Ha az időponthoz foglalások tartoznak, figyelmeztetés után
        // azokat is törli. Lokális időpont esetén csak a lokális listából távolítja el.
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
                var kapcsolodoFoglalasok = _foglalasok.Where(f => f.IdopontId == kivalasztott.Id).ToList();
                if (kapcsolodoFoglalasok.Count > 0)
                {
                    var megerosit = MessageBox.Show(
                        $"Az időponthoz {kapcsolodoFoglalasok.Count} foglalás tartozik!\nEzek is törlődnek. Folytatja?",
                        "Figyelem", MessageBoxButton.YesNo, MessageBoxImage.Warning);
                    if (megerosit != MessageBoxResult.Yes) return;

                    foreach (var f in kapcsolodoFoglalasok)
                        _fuggoBenMuveletek.Add(new FuggoBenMuvelet
                        {
                            Tipus = MuveletTipus.FoglalasTöröl,
                            FoglalasId = f.Id,
                            FoglalasiAdatokId = f.FoglalasiAdatokId
                        });
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

        private async void BtnFelhasznaloKezeles_Click(object sender, RoutedEventArgs e)
        {
            if (_felhasznalok.Count == 0)
            {
                MessageBox.Show("Nincs betöltött felhasználó!", "Figyelem",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            var ablak = new FelhasznaloKezelesWindow(_httpClient, _felhasznalok, _bejelentkezettAdminId) { Owner = this };
            if (ablak.ShowDialog() != true || ablak.Eredmeny == null) return;

            var eredmeny = ablak.Eredmeny;
            string uzenet = eredmeny.Muvelet switch
            {
                FelhasznaloMuvelet.AdminAdd => "✅ Admin hozzáférés sikeresen megadva!",
                FelhasznaloMuvelet.AdminRemove => "✅ Admin hozzáférés sikeresen elvéve!",
                FelhasznaloMuvelet.Delete => "✅ Felhasználó sikeresen törölve!",
                _ => "✅ Művelet sikeres!"
            };

            MessageBox.Show(uzenet, "Sikeres", MessageBoxButton.OK, MessageBoxImage.Information);

            await AdatokBetoltese();
        }
    }
}
