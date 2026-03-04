using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Windows;
using System.Windows.Input;

namespace AdminWPF.Windows
{
    public partial class BejelentkezesWindow : Window
    {
        private const string AdminEmail  = "admin@delibabetterem.hu";
        private const string AdminJelszo = "admin1234";

        private readonly HttpClient _httpClient;

        public BejelentkezesWindow(HttpClient httpClient)
        {
            InitializeComponent();
            _httpClient = httpClient;
            txtEmail.Focus();
        }

        private void Input_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
                BtnBelepes_Click(sender, new RoutedEventArgs());
        }

        private async void BtnBelepes_Click(object sender, RoutedEventArgs e)
        {
            string email  = txtEmail.Text.Trim();
            string jelszo = pbJelszo.Password;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(jelszo))
            {
                MutasdHiba("Töltse ki az email és jelszó mezőket!");
                return;
            }

            // Nem admin email → azonnali elutasítás, API hívás nélkül
            if (!email.Equals(AdminEmail, StringComparison.OrdinalIgnoreCase))
            {
                MutasdHiba("Hozzáférés megtagadva!\nCsak admin jogosultságú fiókkal lehet belépni.");
                return;
            }

            // Admin email + helyes jelszó → egyből beengedjük, API nélkül
            if (jelszo == AdminJelszo)
            {
                DialogResult = true;
                return;
            }

            // Helytelen jelszó
            MutasdHiba("Hibás jelszó!");
        }

        private void MutasdHiba(string uzenet)
        {
            txtHiba.Text       = uzenet;
            txtHiba.Visibility = Visibility.Visible;
        }
    }
}
