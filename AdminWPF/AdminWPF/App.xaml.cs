using System;
using System.Net.Http;
using System.Windows;
using AdminWPF.Windows;

namespace AdminWPF
{
    public partial class App : Application
    {
        private void Application_Startup(object sender, StartupEventArgs e)
        {
            var loginClient = new HttpClient
            {
                BaseAddress = new Uri("http://localhost:8000"),
                Timeout     = TimeSpan.FromSeconds(5)
            };

            var bejelentkezes = new BejelentkezesWindow(loginClient);
            bool? eredmeny = bejelentkezes.ShowDialog();

            if (eredmeny != true)
            {
                Shutdown();
                return;
            }

            var mainClient = new HttpClient
            {
                BaseAddress = new Uri("http://localhost:8000"),
                Timeout     = TimeSpan.FromSeconds(30)
            };

            // Átadjuk a bejelentkezett admin ID-ját a főablaknak
            var mainWindow = new MainWindow(mainClient, bejelentkezes.BejelentkezettId);
            mainWindow.Closed += (_, _) => Shutdown();
            mainWindow.Show();
        }
    }
}
