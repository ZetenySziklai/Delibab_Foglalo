using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using System.Windows.Threading;
using AdminWPF.Models;

namespace AdminWPF
{
    /// <summary>
    /// AdminOldal - Fő ablak kezelése
    /// </summary>
    public partial class MainWindow : Window
    {
        // Ez az osztály kezeli az adatokat (asztalok, időpontok, foglalások)
        private AdatokLekerese adatokKezelo;

        // Ez jelzi, hogy van-e mentetlen változás
        private bool vanMentetlenValtozas = false;

        // Konstruktor - itt inicializáljuk az adatkezelőt
        public MainWindow()
        {
            InitializeComponent();
            adatokKezelo = new AdatokLekerese();
            this.Loaded += Window_Loaded;
        }

        // Window betöltésekor automatikusan betöltjük az adatokat az API-ból
        private async void Window_Loaded(object sender, RoutedEventArgs e)
        {
            await AdatokBetolteseAPIbol();
        }

        // ============================================
        // ADATOK BETÖLTÉSE AZ API-BÓL
        // ============================================
        /// <summary>
        /// Betölti az adatokat az API-ból (asztalok, időpontok, foglalások)
        /// Ha nincs adat vagy az API nem elérhető, üres táblát mutat
        /// </summary>
        private async System.Threading.Tasks.Task AdatokBetolteseAPIbol()
        {
            // Először töröljük az összes adatot, hogy biztosan ne legyen beégetett adat
            adatokKezelo.adatok.Clear();
            adatokKezelo.asztalKapacitasok.Clear();
            adatokKezelo.asztalIds.Clear();
            adatokKezelo.idopontIds.Clear();
            adatokKezelo.foglalasok.Clear();
            adatokKezelo.toroltFoglalasIds.Clear();
            
            try
            {
                UpdateStatus("⏳ Adatok betöltése az API-ból...", Colors.Orange);

                // 1. LÉPÉS: Asztalok lekérése az API-ból
                var asztalEredmeny = await adatokKezelo.AsztalokLekereseAPIbol();
                
                if (!asztalEredmeny.Sikeres)
                {
                    // Ha nem sikerült (pl. API nem elérhető), NEM töltünk be semmilyen adatot
                    // Csak hibaüzenetet mutatunk
                    string hibaUzenet = "API nem elérhető: " + adatokKezelo.UtolsoHiba;
                    UpdateStatus("❌ " + hibaUzenet, Colors.Red);
                    
                    // Üres táblázat
                    dataGrid1.Columns.Clear();
                    dataGrid1.ItemsSource = null;
                    comboBoxAsztalTorlendo.Items.Clear();
                    comboBoxIdopontTorlendo.Items.Clear();
                    vanMentetlenValtozas = false;
                    
                    // Részletes hibaüzenet
                    string reszletesHiba = "Az API nem elérhető!\n\n" +
                        "Hiba részletek:\n" + adatokKezelo.UtolsoHiba + "\n\n" +
                        "Ellenőrizd:\n" +
                        "1. Fut-e a Backend? (npm run start vagy npm run dev)\n" +
                        "   URL: http://localhost:8000/api/asztalok\n" +
                        "2. Fut-e a MySQL? (XAMPP)\n" +
                        "3. Létre van-e hozva az 'asztalfoglalas' adatbázis?\n" +
                        "4. A backend fut-e a 8000-es porton?\n\n" +
                        "Teszteld a böngészőben:\n" +
                        "http://localhost:8000/api/asztalok\n\n" +
                        "Az alkalmazás üres táblázattal folytatja.\n" +
                        "Nincs helyi adat - minden adat az API-ból jön.";
                    
                    MessageBox.Show(
                        reszletesHiba,
                        "API nem elérhető",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning);
                    return;
                }
                
                // Ha nincs asztal az adatbázisban, ez NEM hiba - csak üres lista
                if (adatokKezelo.asztalKapacitasok.Count == 0)
                {
                    UpdateStatus("ℹ️ Nincs asztal az adatbázisban - üres táblázat", Colors.Gray);
                }

                // 2. LÉPÉS: Időpontok lekérése az API-ból
                var idopontEredmeny = await adatokKezelo.IdopontokLekereseAPIbol();
                
                if (!idopontEredmeny.Sikeres)
                {
                    // Ha valódi hiba történt (nem csak üres lista)
                    string hibaUzenet = "Hiba az időpontok lekérésekor: " + adatokKezelo.UtolsoHiba;
                    UpdateStatus("⚠️ " + hibaUzenet, Colors.Orange);
                }
                else
                {
                    int idopontokSzama = adatokKezelo.adatok.Count;
                    int asztalokSzama = adatokKezelo.asztalKapacitasok.Count;
                    
                    if (asztalokSzama == 0 && idopontokSzama == 0)
                    {
                        UpdateStatus("ℹ️ Nincsenek adatok az adatbázisban - üres táblázat", Colors.Gray);
                    }
                    else if (idopontokSzama == 0)
                    {
                        UpdateStatus("✅ Asztalok betöltve (" + asztalokSzama + " asztal), nincs időpont az adatbázisban", Colors.LightGreen);
                    }
                    else
                    {
                        UpdateStatus("✅ Adatok betöltve az API-ból (" + asztalokSzama + " asztal, " + idopontokSzama + " időpont)", Colors.LightGreen);
                    }
                }

                // 3. LÉPÉS: Foglalások lekérése (mai napra)
                string maiDatum = DateTime.Now.ToString("yyyy-MM-dd");
                var foglalasEredmeny = await adatokKezelo.FoglalasokLekereseAPIbol(maiDatum);
                
                if (foglalasEredmeny.Sikeres)
                {
                    List<FoglalasDto> foglalasok = (List<FoglalasDto>)foglalasEredmeny.Eredmeny;
                    if (foglalasok != null && foglalasok.Count > 0)
                    {
                        adatokKezelo.FrissitElerhetosegekFoglalasokAlapjan(foglalasok);
                    }
                }
            }
            catch (Exception ex)
            {
                // Hiba esetén töröljük az összes adatot
                adatokKezelo.adatok.Clear();
                adatokKezelo.asztalKapacitasok.Clear();
                adatokKezelo.asztalIds.Clear();
                adatokKezelo.idopontIds.Clear();
                adatokKezelo.foglalasok.Clear();
                
                // Hiba esetén NEM töltünk be semmilyen adatot
                string hibaUzenet = "API hiba: " + ex.Message;
                UpdateStatus("❌ " + hibaUzenet, Colors.Red);
                
                // Üres táblázat
                dataGrid1.Columns.Clear();
                dataGrid1.ItemsSource = null;
                comboBoxAsztalTorlendo.Items.Clear();
                comboBoxIdopontTorlendo.Items.Clear();
                vanMentetlenValtozas = false;
                
                // Részletes hibaüzenet
                string reszletesHiba = "Hiba történt az API elérésekor!\n\n" +
                    "Hiba részletek:\n" + ex.Message + "\n\n";
                
                if (ex.InnerException != null)
                {
                    reszletesHiba += "Belső hiba: " + ex.InnerException.Message + "\n\n";
                }
                
                reszletesHiba += "Ellenőrizd:\n" +
                    "1. Fut-e a Backend? (npm run start vagy npm run dev)\n" +
                    "   URL: http://localhost:8000/api/asztalok\n" +
                    "2. Fut-e a MySQL? (XAMPP)\n" +
                    "3. Létre van-e hozva az 'asztalfoglalas' adatbázis?\n" +
                    "4. A backend fut-e a 8000-es porton?\n\n" +
                    "Teszteld a böngészőben:\n" +
                    "http://localhost:8000/api/asztalok\n\n" +
                    "Az alkalmazás üres táblázattal folytatja.\n" +
                    "Nincs helyi adat - minden adat az API-ból jön.";
                
                MessageBox.Show(
                    reszletesHiba,
                    "API hiba",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return;
            }

            // Grid és ComboBox-ok frissítése
            GridBeallitasa();
            GridFrissitese();
            ComboBoxokFrissitese();
            vanMentetlenValtozas = false;
        }

        /// <summary>
        /// Status label frissítése
        /// </summary>
        private void UpdateStatus(string text, Color color)
        {
            Dispatcher.Invoke(() =>
            {
                labelStatus.Content = text;
                labelStatus.Foreground = new SolidColorBrush(color);
            });
        }

        // ============================================
        // GRID BEÁLLÍTÁSA ÉS FRISSÍTÉSE
        // ============================================
        /// <summary>
        /// Beállítja a grid oszlopait (asztalok)
        /// </summary>
        private void GridBeallitasa()
        {
            // Töröljük a régi oszlopokat
            dataGrid1.Columns.Clear();
            
            // Asztal oszlopok hozzáadása
            int asztalokSzama = adatokKezelo.SzamolAsztalokSzama();
            for (int i = 0; i < asztalokSzama; i++)
            {
                // Kapacitás lekérése
                int kapacitas = 0;
                if (i < adatokKezelo.asztalKapacitasok.Count)
                {
                    kapacitas = adatokKezelo.asztalKapacitasok[i];
                }

                // Új oszlop létrehozása
                DataGridTextColumn oszlop = new DataGridTextColumn();
                oszlop.Header = "Asztal " + (i + 1) + "\n(" + kapacitas + " fő)";
                oszlop.Binding = new System.Windows.Data.Binding($"AsztalAllapotok[{i}]")
                {
                    Converter = new BoolToTextConverter()
                };
                oszlop.Width = new DataGridLength(100);
                oszlop.IsReadOnly = true;
                oszlop.ElementStyle = new Style(typeof(TextBlock))
                {
                    Setters =
                    {
                        new Setter(TextBlock.TextAlignmentProperty, TextAlignment.Center),
                        new Setter(TextBlock.HorizontalAlignmentProperty, HorizontalAlignment.Center),
                        new Setter(TextBlock.VerticalAlignmentProperty, VerticalAlignment.Center),
                        new Setter(TextBlock.PaddingProperty, new Thickness(10))
                    }
                };
                dataGrid1.Columns.Add(oszlop);
            }
        }

        /// <summary>
        /// Feltölti a grid-et az adatokkal
        /// </summary>
        private void GridFrissitese()
        {
            // Töröljük a régi sorokat
            dataGrid1.ItemsSource = null;
            
            // Ha nincs időpont, üres táblát mutatunk
            if (adatokKezelo.adatok.Count == 0)
            {
                return;
            }
            
            // Grid adatforrás létrehozása
            List<GridRowData> gridAdatok = new List<GridRowData>();
            
            // Minden időponthoz hozzáadunk egy sort
            foreach (var idopont in adatokKezelo.adatok)
            {
                GridRowData sor = new GridRowData();
                sor.Idopont = idopont.ido;
                sor.AsztalAllapotok = new List<bool>(idopont.asztal);
                
                gridAdatok.Add(sor);
            }
            
            dataGrid1.ItemsSource = gridAdatok;
        }

        /// <summary>
        /// Frissíti a ComboBox-okat (asztal és időpont törléshez)
        /// </summary>
        private void ComboBoxokFrissitese()
        {
            // Asztal törlés ComboBox
            comboBoxAsztalTorlendo.Items.Clear();
            int asztalokSzama = adatokKezelo.SzamolAsztalokSzama();
            for (int i = 0; i < asztalokSzama; i++)
            {
                int kapacitas = 0;
                if (i < adatokKezelo.asztalKapacitasok.Count)
                {
                    kapacitas = adatokKezelo.asztalKapacitasok[i];
                }
                comboBoxAsztalTorlendo.Items.Add("Asztal " + (i + 1) + " (" + kapacitas + " fő)");
            }

            // Időpont törlés ComboBox
            comboBoxIdopontTorlendo.Items.Clear();
            foreach (var idopont in adatokKezelo.adatok)
            {
                comboBoxIdopontTorlendo.Items.Add(idopont.ido);
            }
        }

        // ============================================
        // CELLÁK KEZELÉSE
        // ============================================
        private void DataGrid1_MouseLeftButtonUp(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (dataGrid1.CurrentCell == null)
                return;

            var cella = dataGrid1.CurrentCell;
            int oszlopIndex = cella.Column.DisplayIndex;
            int sorIndex = dataGrid1.SelectedIndex;

            if (sorIndex < 0 || sorIndex >= adatokKezelo.adatok.Count)
                return;

            if (oszlopIndex < 0 || oszlopIndex >= adatokKezelo.asztalIds.Count)
                return;

            var sorAdat = adatokKezelo.adatok[sorIndex];
            
            // Csak foglalt cellát lehet törölni (piros = false)
            if (sorAdat.asztal[oszlopIndex] == true)
            {
                // Szabad cella - nincs mit törölni
                return;
            }

            // Foglalt cella - töröljük a foglalást
            int asztalId = adatokKezelo.asztalIds[oszlopIndex];
            string idopontString = sorAdat.ido;

            // Keresünk a foglalások között
            // Az idopontString formátuma: "HH:mm-HH:mm" (pl. "9:00-10:00")
            // A foglalás dátum/időpontja tartalmazza a teljes dátumot és időt
            var torlendoFoglalas = adatokKezelo.foglalasok.FirstOrDefault(f =>
            {
                if (f.AsztalId != asztalId)
                    return false;

                // Időpont ellenőrzés - az idopontString első része (pl. "9:00")
                string idopontKezdete = idopontString.Split('-')[0];
                string foglalasIdo = f.FoglalasDatum.ToString("HH:mm");
                
                // Ellenőrizzük, hogy a foglalás időpontja egyezik-e
                return foglalasIdo == idopontKezdete;
            });

            if (torlendoFoglalas != null)
            {
                // Megerősítés
                var megerosites = MessageBox.Show(
                    $"Biztosan törölni szeretnéd ezt a foglalást?\n\n" +
                    $"Asztal: {comboBoxAsztalTorlendo.Items[oszlopIndex]}\n" +
                    $"Időpont: {idopontString}",
                    "Foglalás törlése",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);

                if (megerosites == MessageBoxResult.Yes)
                {
                    // Hozzáadjuk a törlendő foglalások listájához
                    adatokKezelo.toroltFoglalasIds.Add(torlendoFoglalas.Id);
                    
                    // Töröljük a foglalást a listából
                    adatokKezelo.foglalasok.Remove(torlendoFoglalas);
                    
                    // Frissítjük a cellát szabadra
                    sorAdat.asztal[oszlopIndex] = true;
                    
                    // Frissítjük a grid-et
                    GridFrissitese();
                    
                    // Jelöljük, hogy van mentetlen változás
                    vanMentetlenValtozas = true;
                    UpdateStatus("⚠️ Mentetlen változások vannak", Colors.Orange);
                }
            }
        }

        private void DataGrid1_LoadingRow(object sender, DataGridRowEventArgs e)
        {
            if (e.Row.Item is GridRowData rowData)
            {
                e.Row.Header = rowData.Idopont;
                e.Row.Height = 35;
                
                // Cellák színének beállítása
                Dispatcher.BeginInvoke(new Action(() =>
                {
                    for (int i = 0; i < dataGrid1.Columns.Count && i < rowData.AsztalAllapotok.Count; i++)
                    {
                        var column = dataGrid1.Columns[i];
                        var cellContent = column.GetCellContent(e.Row);
                        if (cellContent != null)
                        {
                            var cell = cellContent.Parent as DataGridCell;
                            if (cell != null)
                            {
                                bool elerheto = rowData.AsztalAllapotok[i];
                                Color cellColor = elerheto ? Color.FromRgb(40, 167, 69) : Color.FromRgb(220, 53, 69);
                                cell.Background = new SolidColorBrush(cellColor);
                                cell.Foreground = new SolidColorBrush(Colors.White);
                            }
                        }
                    }
                }), DispatcherPriority.Loaded);
            }
        }

        // ============================================
        // ASZTAL HOZZÁADÁSA
        // ============================================
        private async void BtnAsztalHozzaad_Click(object sender, RoutedEventArgs e)
        {
            UjAsztalAblak ablak = new UjAsztalAblak();
            ablak.Owner = this;
            
            if (ablak.ShowDialog() == true && ablak.Sikeres)
            {
                // Sikeres hozzáadás után frissítjük az adatokat
                await AdatokBetolteseAPIbol();
                MessageBox.Show("Asztal sikeresen hozzáadva!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        // ============================================
        // ASZTAL TÖRLÉSE
        // ============================================
        private async void BtnAsztalTorol_Click(object sender, RoutedEventArgs e)
        {
            if (comboBoxAsztalTorlendo.SelectedItem == null)
            {
                MessageBox.Show("Kérlek válassz ki egy asztalt a törléshez!", "Nincs kiválasztva", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            int kivalasztottIndex = comboBoxAsztalTorlendo.SelectedIndex;
            
            if (kivalasztottIndex < 0 || kivalasztottIndex >= adatokKezelo.asztalIds.Count)
            {
                MessageBox.Show("Hibás asztal kiválasztás!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            // Megerősítés
            var megerosites = MessageBox.Show(
                "Biztosan törölni szeretnéd ezt az asztalt?\n\n" + comboBoxAsztalTorlendo.SelectedItem.ToString(),
                "Asztal törlése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (megerosites != MessageBoxResult.Yes)
                return;

            try
            {
                int asztalId = adatokKezelo.asztalIds[kivalasztottIndex];
                var apiService = new Services.ApiService();
                bool sikeres = await apiService.DeleteAsztalAsync(asztalId);

                if (sikeres)
                {
                    // Sikeres törlés után frissítjük az adatokat
                    await AdatokBetolteseAPIbol();
                    MessageBox.Show("Asztal sikeresen törölve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                {
                    MessageBox.Show("Hiba történt az asztal törlésekor!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ============================================
        // IDŐPONT HOZZÁADÁSA
        // ============================================
        private async void BtnIdopontHozzaad_Click(object sender, RoutedEventArgs e)
        {
            UjIdopontAblak ablak = new UjIdopontAblak();
            ablak.Owner = this;
            
            if (ablak.ShowDialog() == true && ablak.Sikeres)
            {
                // Sikeres hozzáadás után frissítjük az adatokat
                await AdatokBetolteseAPIbol();
                MessageBox.Show("Időpont sikeresen hozzáadva!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
            }
        }

        // ============================================
        // IDŐPONT TÖRLÉSE
        // ============================================
        private async void BtnIdopontTorol_Click(object sender, RoutedEventArgs e)
        {
            if (comboBoxIdopontTorlendo.SelectedItem == null)
            {
                MessageBox.Show("Kérlek válassz ki egy időpontot a törléshez!", "Nincs kiválasztva", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            int kivalasztottIndex = comboBoxIdopontTorlendo.SelectedIndex;
            
            if (kivalasztottIndex < 0 || kivalasztottIndex >= adatokKezelo.idopontIds.Count)
            {
                MessageBox.Show("Hibás időpont kiválasztás!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            // Megerősítés
            var megerosites = MessageBox.Show(
                "Biztosan törölni szeretnéd ezt az időpontot?\n\n" + comboBoxIdopontTorlendo.SelectedItem.ToString(),
                "Időpont törlése",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (megerosites != MessageBoxResult.Yes)
                return;

            try
            {
                int idopontId = adatokKezelo.idopontIds[kivalasztottIndex];
                var apiService = new Services.ApiService();
                bool sikeres = await apiService.DeleteIdopontAsync(idopontId);

                if (sikeres)
                {
                    // Sikeres törlés után frissítjük az adatokat
                    await AdatokBetolteseAPIbol();
                    MessageBox.Show("Időpont sikeresen törölve!", "Siker", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                else
                {
                    MessageBox.Show("Hiba történt az időpont törlésekor!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // ============================================
        // MENTÉS ÉS FRISSÍTÉS
        // ============================================
        private async void BtnMentes_Click(object sender, RoutedEventArgs e)
        {
            if (!vanMentetlenValtozas)
            {
                MessageBox.Show("Nincs mentendő változás!", "Információ", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            try
            {
                UpdateStatus("⏳ Mentés folyamatban...", Colors.Orange);
                
                var apiService = new Services.ApiService();
                int toroltFoglalasok = 0;
                int hibaSzamlalo = 0;

                // Töröljük az API-ból a törölt foglalásokat
                foreach (int foglalasId in adatokKezelo.toroltFoglalasIds)
                {
                    bool sikeres = await apiService.DeleteFoglalasAsync(foglalasId);
                    if (sikeres)
                    {
                        toroltFoglalasok++;
                    }
                    else
                    {
                        hibaSzamlalo++;
                    }
                }

                // Töröljük a törölt foglalások listáját
                adatokKezelo.toroltFoglalasIds.Clear();

                // Frissítjük az adatokat
                await AdatokBetolteseAPIbol();
                
                vanMentetlenValtozas = false;
                
                string uzenet = $"Mentés sikeres!\n\nTörölt foglalások: {toroltFoglalasok}";
                if (hibaSzamlalo > 0)
                {
                    uzenet += $"\nHibák száma: {hibaSzamlalo}";
                }
                
                UpdateStatus("✅ Mentés sikeres", Colors.LightGreen);
                MessageBox.Show(uzenet, "Mentés", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                UpdateStatus("❌ Mentés hiba", Colors.Red);
                MessageBox.Show("Hiba történt a mentés során: " + ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async void BtnFrissites_Click(object sender, RoutedEventArgs e)
        {
            if (vanMentetlenValtozas)
            {
                var megerosites = MessageBox.Show(
                    "Mentetlen változásaid vannak!\n\nBiztosan szeretnéd újratölteni az adatokat az API-ból?\nA változásaid elvesznek!",
                    "Figyelmeztetés",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);

                if (megerosites != MessageBoxResult.Yes)
                    return;
            }

            await AdatokBetolteseAPIbol();
            MessageBox.Show("Adatok frissítve!", "Frissítés", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        // ============================================
        // WINDOW BEZÁRÁSA
        // ============================================
        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            if (vanMentetlenValtozas)
            {
                var eredmeny = MessageBox.Show(
                    "Mentetlen változásaid vannak!\n\nSzeretned menteni kilépés előtt?",
                    "Mentetlen változások",
                    MessageBoxButton.YesNoCancel,
                    MessageBoxImage.Warning);

                if (eredmeny == MessageBoxResult.Yes)
                {
                    BtnMentes_Click(this, new RoutedEventArgs());
                }
                else if (eredmeny == MessageBoxResult.Cancel)
                {
                    e.Cancel = true;
                }
            }
            base.OnClosing(e);
        }
    }

    /// <summary>
    /// Grid sor adat osztály
    /// </summary>
    public class GridRowData
    {
        public string Idopont { get; set; }
        public List<bool> AsztalAllapotok { get; set; } = new List<bool>();
    }

    /// <summary>
    /// Converter: bool -> "Szabad"/"Foglalt"
    /// </summary>
    public class BoolToTextConverter : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            if (value is bool elerheto)
            {
                return elerheto ? "Szabad" : "Foglalt";
            }
            return "Szabad";
        }

        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
    }
}
