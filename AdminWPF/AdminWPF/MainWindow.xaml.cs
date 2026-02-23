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
        private readonly HttpClient _httpClient = new HttpClient
        {
            BaseAddress = new Uri("http://localhost:8000")
        };

        private AsztalService   _asztalService;
        private IdopontService  _idopontService;
        private FoglalasService _foglalasService;

        private List<Asztal>   _asztalok   = new();
        private List<Idopont>  _idopontok  = new();
        private List<Foglalas> _foglalasok = new();

        private readonly List<RacsCella> _valtozasok = new();

        public MainWindow()
        {
            InitializeComponent();
            _asztalService   = new AsztalService(_httpClient);
            _idopontService  = new IdopontService(_httpClient);
            _foglalasService = new FoglalasService(_httpClient);
            Loaded += async (_, _) => await AdatokBetoltese();
        }

        // ─────────────────────────────────────────────
        //  ADATOK BETÖLTÉSE
        // ─────────────────────────────────────────────
        private async Task AdatokBetoltese()
        {
            labelStatus.Content    = "Betöltés...";
            btnMentes.IsEnabled    = false;
            btnFrissites.IsEnabled = false;

            try
            {
                _asztalok   = await _asztalService.GetAsztalokAsync();
                _idopontok  = await _idopontService.GetIdopontokAsync();
                _foglalasok = await _foglalasService.GetFoglalasokAsync();
                _valtozasok.Clear();

                RacsEpitese();

                labelStatus.Content =
                    $"Betöltve – {_asztalok.Count} asztal, {_idopontok.Count} időpont, {_foglalasok.Count} foglalás";
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
                btnMentes.IsEnabled    = true;
                btnFrissites.IsEnabled = true;
            }
        }

        // ─────────────────────────────────────────────
        //  RÁCS ÉPÍTÉSE
        //  Sorok    = időpontok  (Idopont)
        //  Oszlopok = asztalok   (Asztal)
        //  Zöld = szabad, Piros = foglalt
        // ─────────────────────────────────────────────
        private void RacsEpitese()
        {
            gridFoglalas.Children.Clear();
            gridFoglalas.ColumnDefinitions.Clear();
            gridFoglalas.RowDefinitions.Clear();

            if (_asztalok.Count == 0 || _idopontok.Count == 0)
            {
                gridFoglalas.Children.Add(new TextBlock
                {
                    Text = $"Nincs megjeleníthető adat.\n" +
                           $"Asztalok: {_asztalok.Count}  |  Időpontok: {_idopontok.Count}\n" +
                           $"Adjon hozzá asztalokat és időpontokat!",
                    FontFamily          = new FontFamily("Segoe UI"),
                    FontSize            = 13,
                    Foreground          = Brushes.Gray,
                    TextAlignment       = System.Windows.TextAlignment.Center,
                    HorizontalAlignment = HorizontalAlignment.Center,
                    VerticalAlignment   = VerticalAlignment.Center,
                    Margin              = new Thickness(20)
                });
                return;
            }

            // Oszlopok: 1 fejléc + N asztal
            gridFoglalas.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(110) });
            foreach (var _ in _asztalok)
                gridFoglalas.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(90) });

            // Sorok: 1 fejléc + N időpont
            gridFoglalas.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
            foreach (var _ in _idopontok)
                gridFoglalas.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

            // Bal felső sarok
            AddFejlecCella(0, 0, "Időpont \\ Asztal");

            // Asztal fejlécek (0. sor)
            for (int a = 0; a < _asztalok.Count; a++)
                AddFejlecCella(0, a + 1, $"Asztal #{_asztalok[a].Id}\n({_asztalok[a].HelyekSzama} fő)");

            // Időpont sorok + cellák
            for (int i = 0; i < _idopontok.Count; i++)
            {
                var idopont = _idopontok[i];
                int sor     = i + 1;

                AddFejlecCella(sor, 0, idopont.ToString());

                for (int a = 0; a < _asztalok.Count; a++)
                {
                    var asztal = _asztalok[a];

                    // Foglalás: AsztalId + IdopontId egyezés alapján
                    var meglevo = _foglalasok.FirstOrDefault(f =>
                        f.AsztalId == asztal.Id && f.IdopontId == idopont.Id);

                    bool foglalt    = meglevo != null;
                    int? foglalasId = meglevo?.Id;

                    var cellaAdat = new RacsCella
                    {
                        AsztalId      = asztal.Id,
                        IdopontId     = idopont.Id,
                        IdopontKezdet = idopont.Kezdet,
                        Foglalt       = foglalt,
                        FoglalasId    = foglalasId
                    };

                    var cella = new Border
                    {
                        Background = FoglaltSzin(foglalt),
                        Margin     = new Thickness(1),
                        Cursor     = Cursors.Hand,
                        Tag        = cellaAdat
                    };

                    cella.Child = new TextBlock
                    {
                        Text                = foglalt ? "●" : "○",
                        Foreground          = Brushes.White,
                        FontSize            = 14,
                        HorizontalAlignment = HorizontalAlignment.Center,
                        VerticalAlignment   = VerticalAlignment.Center,
                        Margin              = new Thickness(0, 10, 0, 10)
                    };

                    cella.MouseLeftButtonUp += Cella_Kattintas;
                    Grid.SetRow(cella, sor);
                    Grid.SetColumn(cella, a + 1);
                    gridFoglalas.Children.Add(cella);
                }
            }
        }

        private void AddFejlecCella(int sor, int oszlop, string szoveg)
        {
            var border = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(45, 45, 48)),
                Margin     = new Thickness(1)
            };
            border.Child = new TextBlock
            {
                Text                = szoveg,
                Foreground          = Brushes.White,
                FontFamily          = new FontFamily("Segoe UI"),
                FontSize            = 9,
                FontWeight          = FontWeights.Bold,
                TextAlignment       = System.Windows.TextAlignment.Center,
                HorizontalAlignment = HorizontalAlignment.Center,
                Margin              = new Thickness(6, 8, 6, 8)
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

            adat.Foglalt     = !adat.Foglalt;
            cella.Background = FoglaltSzin(adat.Foglalt);

            if (cella.Child is TextBlock tb)
                tb.Text = adat.Foglalt ? "●" : "○";

            _valtozasok.RemoveAll(v => v.AsztalId == adat.AsztalId && v.IdopontId == adat.IdopontId);
            _valtozasok.Add(new RacsCella
            {
                AsztalId      = adat.AsztalId,
                IdopontId     = adat.IdopontId,
                IdopontKezdet = adat.IdopontKezdet,
                Foglalt       = adat.Foglalt,
                FoglalasId    = adat.FoglalasId
            });
        }

        // ─────────────────────────────────────────────
        //  MENTÉS
        // ─────────────────────────────────────────────
        private async void BtnMentes_Click(object sender, RoutedEventArgs e)
        {
            if (_valtozasok.Count == 0)
            {
                MessageBox.Show("Nincs mentendő változás.", "Mentés",
                    MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            btnMentes.IsEnabled = false;
            labelStatus.Content = "Mentés...";
            int sikeres = 0, sikertelen = 0;

            foreach (var v in _valtozasok)
            {
                try
                {
                    if (v.Foglalt)
                    {
                        var uj = new FoglalasLetrehozas
                        {
                            FelhasznaloId = 1,
                            AsztalId      = v.AsztalId,
                            IdopontId     = v.IdopontId
                        };
                        bool ok = await _foglalasService.CreateFoglalasAsync(uj);
                        if (ok) sikeres++; else sikertelen++;
                    }
                    else
                    {
                        if (v.FoglalasId.HasValue)
                        {
                            bool ok = await _foglalasService.DeleteFoglalasAsync(v.FoglalasId.Value);
                            if (ok) sikeres++; else sikertelen++;
                        }
                        else sikeres++;
                    }
                }
                catch { sikertelen++; }
            }

            await AdatokBetoltese();
            btnMentes.IsEnabled = true;
            labelStatus.Content = $"Mentve – {sikeres} sikeres, {sikertelen} sikertelen";

            if (sikertelen > 0)
                MessageBox.Show($"Mentés részben sikeres.\nSikeres: {sikeres} | Sikertelen: {sikertelen}",
                    "Mentés", MessageBoxButton.OK, MessageBoxImage.Warning);
        }

        // ─────────────────────────────────────────────
        //  FRISSÍTÉS
        // ─────────────────────────────────────────────
        private async void BtnFrissites_Click(object sender, RoutedEventArgs e) =>
            await AdatokBetoltese();

        // ─────────────────────────────────────────────
        //  ASZTAL KEZELÉS
        // ─────────────────────────────────────────────
        private async void BtnAsztalHozzaad_Click(object sender, RoutedEventArgs e)
        {
            var ablak = new AsztalLetrehozasWindow { Owner = this };
            if (ablak.ShowDialog() == true && ablak.Eredmeny != null)
            {
                bool ok = await _asztalService.CreateAsztalAsync(ablak.Eredmeny);
                if (ok) { await AdatokBetoltese(); MessageBox.Show("Asztal létrehozva!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information); }
                else     MessageBox.Show("Nem sikerült létrehozni az asztalt!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void BtnAsztalTorol_Click(object sender, RoutedEventArgs e)
        {
            if (_asztalok.Count == 0) { MessageBox.Show("Nincs törölhető asztal!", "Figyelem", MessageBoxButton.OK, MessageBoxImage.Warning); return; }
            var ablak = new AsztalTorlasWindow(_asztalok) { Owner = this };
            if (ablak.ShowDialog() == true && ablak.KivalasztottAsztal != null)
            {
                bool ok = await _asztalService.DeleteAsztalAsync(ablak.KivalasztottAsztal.Id);
                if (ok) { await AdatokBetoltese(); MessageBox.Show("Asztal törölve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information); }
                else     MessageBox.Show("Nem sikerült törölni az asztalt!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ─────────────────────────────────────────────
        //  IDŐPONT KEZELÉS
        // ─────────────────────────────────────────────
        private async void BtnIdopontHozzaad_Click(object sender, RoutedEventArgs e)
        {
            var ablak = new IdopontLetrehozasWindow { Owner = this };
            if (ablak.ShowDialog() == true && ablak.Eredmeny != null)
            {
                bool ok = await _idopontService.CreateIdopontAsync(ablak.Eredmeny);
                if (ok) { await AdatokBetoltese(); MessageBox.Show("Időpont létrehozva!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information); }
                else     MessageBox.Show("Nem sikerült létrehozni az időpontot!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void BtnIdopontTorol_Click(object sender, RoutedEventArgs e)
        {
            if (_idopontok.Count == 0) { MessageBox.Show("Nincs törölhető időpont!", "Figyelem", MessageBoxButton.OK, MessageBoxImage.Warning); return; }
            var ablak = new IdopontTorlasWindow(_idopontok) { Owner = this };
            if (ablak.ShowDialog() == true && ablak.KivalasztottIdopont != null)
            {
                bool ok = await _idopontService.DeleteIdopontAsync(ablak.KivalasztottIdopont.Id);
                if (ok) { await AdatokBetoltese(); MessageBox.Show("Időpont törölve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information); }
                else     MessageBox.Show("Nem sikerült törölni az időpontot!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}
