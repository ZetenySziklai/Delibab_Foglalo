using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
//Konstruktor

namespace AdatokElerese
{
    public class AdatokLekerese
    {
     
        public List<AdatokFeldolgozasa> adatok = new List<AdatokFeldolgozasa>();

        public AdatokLekerese()
        {
            
            List<AdatokFeldolgozasa> adatok = new List<AdatokFeldolgozasa>();
        // Static HttpClient instance (best practice - reuse instead of creating new instances)
        
        }
        private static readonly HttpClient httpClient = new HttpClient();

        async Task Main(string[] args)
        {
            // Set your API base URL here
            httpClient.BaseAddress = new Uri("https://your-api-url.com/api/");
            httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

            // Fetch data from API
            await AdatokLekeresAPIbol();
        }

        // Fetch data from API using HttpClient
        private async Task AdatokLekeresAPIbol()
        {
            try
            {
                // GET request to retrieve data
                HttpResponseMessage response = await httpClient.GetAsync("adatok"); // Replace "adatok" with your endpoint

                if (response.IsSuccessStatusCode)
                {
                    // Option 1: If API returns JSON array directly
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var apiAdatok = JsonSerializer.Deserialize<List<AdatokFeldolgozasa>>(jsonString);

                    if (apiAdatok != null)
                    {
                        adatok = apiAdatok;
                    }

                    // Option 2: If API returns CSV-like format, parse it
                    // string csvData = await response.Content.ReadAsStringAsync();
                    // string[] lines = csvData.Split('\n');
                    // for (int i = 1; i < lines.Length; i++) // Skip header
                    // {
                    //     if (!string.IsNullOrWhiteSpace(lines[i]))
                    //     {
                    //         AdatokFeldolgozasa s = new AdatokFeldolgozasa(lines[i]);
                    //         adatok.Add(s);
                    //     }
                    // }
                }
                else
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
            }
        }

        // Send data to API (POST request)
        private static async Task AdatokKuldesAPIba(AdatokFeldolgozasa adat)
        {
            try
            {
                // Serialize object to JSON and send as POST request
                HttpResponseMessage response = await httpClient.PostAsJsonAsync("adatok", adat);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Data sent successfully!");
                }
                else
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
            }
        }

        // Update data in API (PUT request)
        private static async Task AdatokFrissitesAPIban(int id, AdatokFeldolgozasa adat)
        {
            try
            {
                HttpResponseMessage response = await httpClient.PutAsJsonAsync($"adatok/{id}", adat);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Data updated successfully!");
                }
                else
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
            }
        }

        // Delete data from API (DELETE request)
        private static async Task AdatokTorlesAPIbol(int id)
        {
            try
            {
                HttpResponseMessage response = await httpClient.DeleteAsync($"adatok/{id}");

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Data deleted successfully!");
                }
                else
                {
                    Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex.Message}");
            }
        }


        public void Fajlbeolvasas()
        {
            StreamReader f = new StreamReader("teszt_adatok");
            f.ReadLine();
            while (!f.EndOfStream)
            {
                AdatokFeldolgozasa s = new AdatokFeldolgozasa(f.ReadLine());
                adatok.Add(s);
            }
            f.Close();
        }
        private void FoglalasValtoztatas()
        {
            for (int i = 0; i < adatok.Count; i++)
            {
                for (int j = 0; j < adatok[i].asztal.Count; j++)
                {
                    Eldontes(adatok[i].asztal[j]);
                }
            }
        }
        private bool Eldontes(bool adat)
        {
            if (adat == false)
            {
                return true;
            }
            else
            {
                return false;
            }
        }




    }
}
