using System;
using System.Windows;
using AdminWPF.Models;
using AdminWPF.Services;

namespace AdminWPF
{
    /// <summary>
    /// Új asztal hozzáadása ablak
    /// </summary>
    public partial class UjAsztalAblak : Window
    {
        private readonly ApiService _apiService;
        public bool Sikeres { get; private set; } = false;
        public AsztalDto UjAsztal { get; private set; }

        public UjAsztalAblak()
        {
            InitializeComponent();
            _apiService = new ApiService();
            textBoxFerohelyek.Focus();
            textBoxFerohelyek.SelectAll();
        }

        private async void BtnMentes_Click(object sender, RoutedEventArgs e)
        {
            // Validálás
            if (string.IsNullOrWhiteSpace(textBoxFerohelyek.Text))
            {
                MessageBox.Show("Kérlek add meg a férőhelyek számát!", "Hiányzó adat", MessageBoxButton.OK, MessageBoxImage.Warning);
                textBoxFerohelyek.Focus();
                return;
            }

            if (!int.TryParse(textBoxFerohelyek.Text, out int ferohelyek) || ferohelyek <= 0)
            {
                MessageBox.Show("A férőhelyek száma pozitív egész szám kell legyen!", "Hibás adat", MessageBoxButton.OK, MessageBoxImage.Warning);
                textBoxFerohelyek.Focus();
                textBoxFerohelyek.SelectAll();
                return;
            }

            try
            {
                // Új asztal létrehozása
                AsztalDto ujAsztal = new AsztalDto
                {
                    HelyekSzama = ferohelyek,
                    AsztalAllapotId = 1 // 1 = szabad (alapértelmezett)
                };

                var eredmeny = await _apiService.CreateAsztalAsync(ujAsztal);
                
                if (eredmeny != null)
                {
                    UjAsztal = eredmeny;
                    Sikeres = true;
                    this.DialogResult = true;
                    this.Close();
                }
                else
                {
                    MessageBox.Show("Hiba történt az asztal létrehozásakor!", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
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
