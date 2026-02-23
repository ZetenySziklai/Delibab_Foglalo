using System.Collections.Generic;
using System.Windows;
using AdminWPF.Models;

namespace AdminWPF.Windows
{
    public partial class IdopontTorlasWindow : Window
    {
        public Idopont? KivalasztottIdopont { get; private set; }

        public IdopontTorlasWindow(List<Idopont> idopontok)
        {
            InitializeComponent();
            comboIdopontok.ItemsSource = idopontok;
            if (idopontok.Count > 0)
                comboIdopontok.SelectedIndex = 0;
        }

        private void BtnTorol_Click(object sender, RoutedEventArgs e)
        {
            if (comboIdopontok.SelectedItem is Idopont idopont)
            {
                var result = MessageBox.Show($"Biztosan törli a(z) {idopont} időpontot?", "Megerősítés",
                    MessageBoxButton.YesNo, MessageBoxImage.Question);
                if (result == MessageBoxResult.Yes)
                {
                    KivalasztottIdopont = idopont;
                    DialogResult = true;
                    Close();
                }
            }
            else
            {
                MessageBox.Show("Kérjük válasszon időpontot!", "Figyelem", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void BtnMegse_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}
