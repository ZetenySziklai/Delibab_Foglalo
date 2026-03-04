using System.Collections.Generic;
using System.Windows;
using AdminWPF.Services;

namespace AdminWPF.Windows
{
    public partial class FoglalasAdatokWindow : Window
    {
        public int    FelhasznaloId { get; private set; }
        public int    Felnott       { get; private set; }
        public int    Gyerek        { get; private set; }
        public string Megjegyzes    { get; private set; } = "";

        private readonly List<Felhasznalo> _felhasznalok;
        private readonly int _asztalMaxFo;  // az asztal kapacitása

        public FoglalasAdatokWindow(int asztalId, string asztalInfo, string idopontInfo,
                                    List<Felhasznalo> felhasznalok, int asztalMaxFo)
        {
            InitializeComponent();
            txtAsztalInfo.Text  = asztalInfo;
            txtIdopontInfo.Text = idopontInfo;
            _felhasznalok       = felhasznalok;
            _asztalMaxFo        = asztalMaxFo;

            if (_felhasznalok.Count == 0)
            {
                txtFelhasznaloHiba.Visibility = Visibility.Visible;
                btnFoglal.IsEnabled           = false;
            }
            else
            {
                cbFelhasznalo.ItemsSource   = _felhasznalok;
                cbFelhasznalo.SelectedIndex = 0;
            }
        }

        private void BtnFoglal_Click(object sender, RoutedEventArgs e)
        {
            if (cbFelhasznalo.SelectedItem is not Felhasznalo kivalasztott)
            {
                MessageBox.Show("Válasszon felhasználót!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(txtFelnott.Text.Trim(), out int felnott) || felnott < 0)
            {
                MessageBox.Show("A felnőttek száma nem lehet negatív!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!int.TryParse(txtGyerek.Text.Trim(), out int gyerek) || gyerek < 0)
            {
                MessageBox.Show("A gyerekek száma nem lehet negatív!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (felnott + gyerek == 0)
            {
                MessageBox.Show("Legalább 1 személy szükséges a foglaláshoz!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Kapacitás ellenőrzés
            if (felnott + gyerek > _asztalMaxFo)
            {
                MessageBox.Show(
                    $"Túl sok személy!\n\nAz asztal maximum {_asztalMaxFo} főt fogad.\n" +
                    $"Megadott személyek: {felnott + gyerek} fő (felnőtt: {felnott}, gyerek: {gyerek})",
                    "Kapacitás túllépés", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            FelhasznaloId = kivalasztott.Id;
            Felnott       = felnott;
            Gyerek        = gyerek;
            Megjegyzes    = txtMegjegyzes.Text.Trim();

            DialogResult = true;
        }

        private void BtnMegse_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
        }
    }
}
