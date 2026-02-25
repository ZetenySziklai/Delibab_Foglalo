using System.Windows;

namespace AdminWPF.Windows
{
    public partial class FoglalasAdatokWindow : Window
    {
        public int    FelhasznaloId { get; private set; }
        public int    Felnott       { get; private set; }
        public int    Gyerek        { get; private set; }
        public string Megjegyzes    { get; private set; } = "";

        public FoglalasAdatokWindow(int asztalId, string asztalInfo, string idopontInfo)
        {
            InitializeComponent();
            txtAsztalInfo.Text  = asztalInfo;
            txtIdopontInfo.Text = idopontInfo;
        }

        private void BtnFoglal_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(txtFelhasznaloId.Text.Trim(), out int fId) || fId <= 0)
            {
                MessageBox.Show("Adjon meg érvényes Felhasználó ID-t!", "Hiba",
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

            FelhasznaloId = fId;
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
