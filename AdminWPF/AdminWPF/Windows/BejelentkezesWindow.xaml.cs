using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Windows;
using System.Windows.Input;

namespace AdminWPF.Windows
{
    public partial class BejelentkezesWindow : Window
    {
        private readonly HttpClient _httpClient;

        public int BejelentkezettId { get; private set; }

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

            btnBelepes.IsEnabled = false;
            txtHiba.Visibility   = Visibility.Collapsed;

            try
            {
                var payload  = new { email, jelszo };
                var response = await _httpClient.PostAsJsonAsync("/api/auth/login", payload);
                string json  = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    // Pontosan megmutatjuk a backend hibaüzenetét
                    try
                    {
                        using var doc = JsonDocument.Parse(json);
                        string? msg = null;
                        if (doc.RootElement.TryGetProperty("msg", out var msgEl))
                            msg = msgEl.GetString();
                        else if (doc.RootElement.TryGetProperty("message", out var msgEl2))
                            msg = msgEl2.GetString();
                        MutasdHiba(msg ?? "Hibás email cím vagy jelszó!");
                    }
                    catch
                    {
                        MutasdHiba("Hibás email cím vagy jelszó!");
                    }
                    return;
                }

                // isAdmin ellenőrzés: kézzel olvassuk ki a JsonDocument-ből
                // hogy elkerüljük a bool/int típuskonverziós hibát
                bool isAdmin = false;
                int  userId  = 0;

                try
                {
                    using var doc = JsonDocument.Parse(json);
                    if (doc.RootElement.TryGetProperty("user", out var userEl))
                    {
                        if (userEl.TryGetProperty("id", out var idEl))
                            userId = idEl.GetInt32();

                        if (userEl.TryGetProperty("isAdmin", out var isAdminEl))
                        {
                            isAdmin = isAdminEl.ValueKind switch
                            {
                                JsonValueKind.True   => true,
                                JsonValueKind.False  => false,
                                JsonValueKind.Number => isAdminEl.GetInt32() == 1,
                                JsonValueKind.String => isAdminEl.GetString() is "1" or "true",
                                _                    => false
                            };
                        }
                    }
                }
                catch (Exception ex)
                {
                    MutasdHiba($"Válasz feldolgozási hiba: {ex.Message}");
                    return;
                }

                if (!isAdmin)
                {
                    MutasdHiba("Hozzáférés megtagadva!\nCsak admin jogosultságú fiókkal lehet belépni.");
                    return;
                }

                BejelentkezettId = userId;
                DialogResult     = true;
            }
            catch (HttpRequestException)
            {
                MutasdHiba("Nem sikerült kapcsolódni a szerverhez.\nEllenőrizze, hogy a backend fut-e!");
            }
            catch (Exception ex)
            {
                MutasdHiba($"Váratlan hiba: {ex.Message}");
            }
            finally
            {
                btnBelepes.IsEnabled = true;
            }
        }

        private void MutasdHiba(string uzenet)
        {
            txtHiba.Text       = uzenet;
            txtHiba.Visibility = Visibility.Visible;
        }
    }
}
