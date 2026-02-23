using System.Collections.Generic;
using System.Windows;
using AdminWPF.Models;

namespace AdminWPF.Windows
{
    public partial class AsztalTorlasWindow : Window
    {
        public Asztal? KivalasztottAsztal { get; private set; }

        public AsztalTorlasWindow(List<Asztal> asztalok)
        {
            InitializeComponent();
            comboAsztalok.ItemsSource = asztalok;
            comboAsztalok.DisplayMemberPath = null;
            if (asztalok.Count > 0)
                comboAsztalok.SelectedIndex = 0;
        }

        private void BtnTorol_Click(object sender, RoutedEventArgs e)
        {
            if (comboAsztalok.SelectedItem is Asztal asztal)
            {
                var result = MessageBox.Show($"Biztosan törli az Asztal #{asztal.Id}-t?", "Megerősítés",
                    MessageBoxButton.YesNo, MessageBoxImage.Question);
                if (result == MessageBoxResult.Yes)
                {
                    KivalasztottAsztal = asztal;
                    DialogResult = true;
                    Close();
                }
            }
            else
            {
                MessageBox.Show("Kérjük válasszon asztalt!", "Figyelem", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void BtnMegse_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
}
