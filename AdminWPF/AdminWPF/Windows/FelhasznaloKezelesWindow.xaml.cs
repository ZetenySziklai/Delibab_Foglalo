using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Windows;
using System.Windows.Controls;
using AdminWPF.Services;

namespace AdminWPF.Windows
{
    public enum FelhasznaloMuvelet { AdminAdd, AdminRemove, Delete }

    public class FelhasznaloMuveletEredmeny
    {
        public int FelhasznaloId { get; set; }
        public FelhasznaloMuvelet Muvelet { get; set; }
    }

    public partial class FelhasznaloKezelesWindow : Window
    {
        private readonly HttpClient _httpClient;
        private readonly List<Felhasznalo> _felhasznalok;
        private readonly int _bejelentkezettAdminId;

        public FelhasznaloMuveletEredmeny? Eredmeny { get; private set; }

        public FelhasznaloKezelesWindow(HttpClient httpClient, List<Felhasznalo> felhasznalok, int bejelentkezettAdminId)
        {
            InitializeComponent();
            _httpClient            = httpClient;
            _felhasznalok          = felhasznalok;
            _bejelentkezettAdminId = bejelentkezettAdminId;

            comboFelhasznalok.ItemsSource = felhasznalok;
            if (felhasznalok.Count > 0)
                comboFelhasznalok.SelectedIndex = 0;

            comboMuvelet.SelectedIndex = 0;
            FrissitsBtnSzin();
        }

        private void ComboFelhasznalok_SelectionChanged(object sender, SelectionChangedEventArgs e)
            => FrissitsBtnSzin();

        private void ComboMuvelet_SelectionChanged(object sender, SelectionChangedEventArgs e)
            => FrissitsBtnSzin();

        private void FrissitsBtnSzin()
        {
            if (comboMuvelet.SelectedItem is not ComboBoxItem item) return;
            string tag = item.Tag?.ToString() ?? "";

            btnVegrehajt.Background = tag switch
            {
                "admin_add"    => System.Windows.Media.Brushes.SteelBlue,
                "admin_remove" => new System.Windows.Media.SolidColorBrush(
                                      System.Windows.Media.Color.FromRgb(230, 126, 34)),
                "delete"       => System.Windows.Media.Brushes.Crimson,
                _              => System.Windows.Media.Brushes.SteelBlue
            };

            btnVegrehajt.Content = tag switch
            {
                "admin_add"    => "👑 Admin adás",
                "admin_remove" => "🚫 Admin elvétel",
                "delete"       => "🗑 Törlés",
                _              => "Végrehajtás"
            };
        }

        private async void BtnVegrehajt_Click(object sender, RoutedEventArgs e)
        {
            if (comboFelhasznalok.SelectedItem is not Felhasznalo felhasznalo)
            {
                MessageBox.Show("Kérjük válasszon felhasználót!", "Figyelem",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (comboMuvelet.SelectedItem is not ComboBoxItem muveletItem) return;
            string tag = muveletItem.Tag?.ToString() ?? "";

            // ── VÉDELMEK ─────────────────────────────────────────────────────

            // 1. Saját fiókot nem lehet törölni vagy admin-jogot elveszíteni
            if (felhasznalo.Id == _bejelentkezettAdminId && (tag == "delete" || tag == "admin_remove"))
            {
                MessageBox.Show(
                    "Nem módosíthatja a saját fiókját!\n\nAz egyetlen admin fiók törlése vagy jogosultságának elvétele megakadályozná a jövőbeli belépést.",
                    "Tiltott művelet", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // 2. Aki már admin, annak nem lehet újra admin jogot adni
            if (tag == "admin_add" && felhasznalo.IsAdmin)
            {
                MessageBox.Show(
                    $"{felhasznalo.TeljesNev} már rendelkezik admin jogosultsággal.",
                    "Már admin", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            // 3. Aki nem admin, attól nem lehet admin jogot elvenni
            if (tag == "admin_remove" && !felhasznalo.IsAdmin)
            {
                MessageBox.Show(
                    $"{felhasznalo.TeljesNev} nem rendelkezik admin jogosultsággal.",
                    "Nem admin", MessageBoxButton.OK, MessageBoxImage.Information);
                return;
            }

            // ── MEGERŐSÍTÉS ───────────────────────────────────────────────────

            string megerositesUzenet = tag switch
            {
                "admin_add"    => $"Admin hozzáférést ad a következő felhasználónak:\n{felhasznalo}",
                "admin_remove" => $"Elveszi az admin hozzáférést:\n{felhasznalo}",
                "delete"       => $"Törli a következő felhasználót és az összes hozzá tartozó foglalást (visszavonhatatlan!):\n{felhasznalo}",
                _              => "Biztos?"
            };

            var megerosit = MessageBox.Show(megerositesUzenet, "Megerősítés",
                MessageBoxButton.YesNo,
                tag == "delete" ? MessageBoxImage.Warning : MessageBoxImage.Question);

            if (megerosit != MessageBoxResult.Yes) return;

            btnVegrehajt.IsEnabled = false;
            btnMegse.IsEnabled     = false;

            try
            {
                if (tag == "admin_add" || tag == "admin_remove")
                {
                    bool ujIsAdmin = tag == "admin_add";
                    var response   = await _httpClient.PutAsJsonAsync(
                        $"/api/users/{felhasznalo.Id}", new { isAdmin = ujIsAdmin });

                    if (!response.IsSuccessStatusCode)
                    {
                        string hiba = await response.Content.ReadAsStringAsync();
                        MessageBox.Show($"Hiba:\n{hiba}", "Hiba", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                }
                else // delete
                {
                    // 1. Felhasználó összes foglalásának lekérése
                    var foglalasokLista = await _httpClient.GetFromJsonAsync<List<FoglalasMin>>("/api/foglalasok");
                    var felhasznaloFoglalasok = foglalasokLista?
                        .Where(f => f.FelhasznaloId == felhasznalo.Id)
                        .ToList() ?? new List<FoglalasMin>();

                    // 2. FoglalasiAdatok lekérése és törlése
                    var foglalasiAdatokLista = await _httpClient.GetFromJsonAsync<List<FoglalasiAdatokMin>>("/api/foglalasi-adatok");

                    foreach (var foglalas in felhasznaloFoglalasok)
                    {
                        var adat = foglalasiAdatokLista?.FirstOrDefault(a => a.FoglalasId == foglalas.Id);
                        if (adat != null)
                            await _httpClient.DeleteAsync($"/api/foglalasi-adatok/{adat.Id}");

                        await _httpClient.DeleteAsync($"/api/foglalasok/{foglalas.Id}");
                    }

                    // 3. Felhasználó törlése
                    var deleteResp = await _httpClient.DeleteAsync($"/api/users/{felhasznalo.Id}");
                    if (!deleteResp.IsSuccessStatusCode)
                    {
                        string hiba = await deleteResp.Content.ReadAsStringAsync();
                        MessageBox.Show($"Hiba a felhasználó törlésekor:\n{hiba}", "Hiba",
                            MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                }

                Eredmeny = new FelhasznaloMuveletEredmeny
                {
                    FelhasznaloId = felhasznalo.Id,
                    Muvelet       = tag switch
                    {
                        "admin_add"    => FelhasznaloMuvelet.AdminAdd,
                        "admin_remove" => FelhasznaloMuvelet.AdminRemove,
                        _              => FelhasznaloMuvelet.Delete
                    }
                };
                DialogResult = true;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hálózati hiba:\n{ex.Message}", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                btnVegrehajt.IsEnabled = true;
                btnMegse.IsEnabled     = true;
            }
        }

        private void BtnMegse_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }

        private class FoglalasMin
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("user_id")]
            public int FelhasznaloId { get; set; }
        }

        private class FoglalasiAdatokMin
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("FoglalaId")]
            public int? FoglalasId { get; set; }
        }
    }
}
