using System;
using System.Windows;
using AdminWPF.Models;
using AdminWPF.Services;

namespace AdminWPF
{
    /// <summary>
    /// Új időpont hozzáadása ablak
    /// </summary>
    public partial class UjIdopontAblak : Window
    {
        private readonly ApiService _apiService;
        public bool Sikeres { get; private set; } = false;
        public IdopontDto UjIdopont { get; private set; }

        public UjIdopontAblak()
        {
            InitializeComponent();
            _apiService = new ApiService();
            textBoxOra.Focus();
            textBoxOra.SelectAll();
        }

        private async void BtnMentes_Click(object sender, RoutedEventArgs e)
        {
            // Validálás
            if (string.IsNullOrWhiteSpace(textBoxOra.Text))
            {
                MessageBox.Show("Kérlek add meg az órát!", "Hiányzó adat", MessageBoxButton.OK, MessageBoxImage.Warning);
                textBoxOra.Focus();
                return;
            }

            if (!int.TryParse(textBoxOra.Text, out int ora) || ora < 0 || ora > 23)
            {
                MessageBox.Show("Az óra 0 és 23 közötti szám kell legyen!", "Hibás adat", MessageBoxButton.OK, MessageBoxImage.Warning);
                textBoxOra.Focus();
                textBoxOra.SelectAll();
                return;
            }

            try
            {
                // Új időpont létrehozása (mai dátum, megadott óra)
                DateTime maiDatum = DateTime.Now.Date;
                DateTime idopontDatum = maiDatum.AddHours(ora);

                IdopontDto ujIdopont = new IdopontDto
                {
                    FoglalasNapIdo = idopontDatum
                };

                var eredmeny = await _apiService.CreateIdopontAsync(ujIdopont);
                
                if (eredmeny != null)
                {
                    UjIdopont = eredmeny;
                    Sikeres = true;
                    this.DialogResult = true;
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Hiba történt az időpont létrehozásakor!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt: " + ex.Message, "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void BtnMegse_Click(object sender, RoutedEventArgs e)
        {
            this.DialogResult = false;
            this.Close();
        }
    }
}
