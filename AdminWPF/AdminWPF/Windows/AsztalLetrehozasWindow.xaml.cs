using System.Windows;
using AdminWPF.Models;

namespace AdminWPF.Windows
{
    public partial class AsztalLetrehozasWindow : Window
    {
        public AsztalLetrehozas? Eredmeny { get; private set; }

        public AsztalLetrehozasWindow()
        {
            InitializeComponent();
        }

        private void BtnLetrehoz_Click(object sender, RoutedEventArgs e)
        {
            if (!int.TryParse(txtHelyekSzama.Text.Trim(), out int helyek) || helyek <= 0)
            {
                MessageBox.Show("Érvényes helyek számát adjon meg! (pozitív egész szám)", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            Eredmeny = new AsztalLetrehozas { HelyekSzama = helyek };
            DialogResult = true;
            Close();
        }

        private void BtnMegse_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}
