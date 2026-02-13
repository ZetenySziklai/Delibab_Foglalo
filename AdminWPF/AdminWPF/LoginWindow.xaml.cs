using System.Windows;

namespace AdminWPF
{
    /// <summary>
    /// Egyszerű bejelentkező ablak az admin felülethez.
    /// Jelenleg csak lokálisan ellenőrzött, beégetett adatokkal dolgozik:
    /// felhasználónév: admin
    /// jelszó: admin123
    /// Később ez könnyen lecserélhető lesz HTTP klienses API-hívásra.
    /// </summary>
    public partial class LoginWindow : Window
    {
        public LoginWindow()
        {
            InitializeComponent();
        }

        private void BtnBejelentkezes_Click(object sender, RoutedEventArgs e)
        {
            string felhasznalo = txtFelhasznalo.Text?.Trim() ?? string.Empty;
            string jelszo = txtJelszo.Password?.Trim() ?? string.Empty;

            // Jelenlegi, egyszerű ellenőrzés – később API-hívásra cserélhető
            if (felhasznalo == "admin" && jelszo == "admin123")
            {
                // Sikeres bejelentkezés – megnyitjuk az admin főablakot
                var mainWindow = new MainWindow();
                mainWindow.Show();

                // A login ablak bezárása
                this.Close();
            }
            else
            {
                // Hibás adatoknál NEM lépünk tovább, csak hibaüzenet
                MessageBox.Show(
                    "Hibás felhasználónév vagy jelszó!",
                    "Bejelentkezési hiba",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
    }
}

