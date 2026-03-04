using System;
using System.Collections.Generic;
using System.Globalization;
using System.Windows;
using AdminWPF.Models;

namespace AdminWPF.Windows
{
    public partial class IdopontLetrehozasWindow : Window
    {
        public IdopontLetrehozas? Eredmeny { get; private set; }

        private readonly List<Idopont> _meglevoIdopontok;

        public IdopontLetrehozasWindow(List<Idopont>? meglevoIdopontok = null)
        {
            InitializeComponent();
            _meglevoIdopontok = meglevoIdopontok ?? new List<Idopont>();
        }

        private void BtnLetrehoz_Click(object sender, RoutedEventArgs e)
        {
            if (!double.TryParse(txtKezdet.Text.Trim().Replace(',', '.'),
                    NumberStyles.Any, CultureInfo.InvariantCulture, out double kezdet)
                || kezdet < 0 || kezdet >= 24)
            {
                MessageBox.Show("Érvényes kezdet értéket adjon meg! (pl. 9 vagy 6.5)", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (!double.TryParse(txtVeg.Text.Trim().Replace(',', '.'),
                    NumberStyles.Any, CultureInfo.InvariantCulture, out double veg)
                || veg <= 0 || veg > 24)
            {
                MessageBox.Show("Érvényes vég értéket adjon meg! (pl. 10 vagy 9.5)", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (kezdet >= veg)
            {
                MessageBox.Show("A kezdet értéknek kisebbnek kell lennie, mint a vég!", "Hiba",
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Ütközés ellenőrzés: az új időpont [kezdet, veg) intervalluma
            // nem fedhet át egyetlen meglévő [i.Kezdet, i.Veg) intervallummal sem.
            // Két intervallum ütközik ha: ujKezdet < meglevoVeg ÉS ujVeg > meglevoKezdet
            foreach (var i in _meglevoIdopontok)
            {
                bool utkozik = kezdet < i.Veg && veg > i.Kezdet;
                if (utkozik)
                {
                    MessageBox.Show(
                        $"Az időpont ütközik egy meglévővel!\n\n" +
                        $"Új időpont:     {Idopont.DoubleToIdo(kezdet)} – {Idopont.DoubleToIdo(veg)}\n" +
                        $"Ütköző időpont: {Idopont.DoubleToIdo(i.Kezdet)} – {Idopont.DoubleToIdo(i.Veg)}",
                        "Időpont ütközés", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }
            }

            Eredmeny = new IdopontLetrehozas { Kezdet = kezdet, Veg = veg };
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
