using System;
using System.Collections.Generic;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using AdatokElerese;
using AdatokElerese.Models;

namespace AdminFelulet
{
    public partial class Form1 : Form
    {
        // Ez az osztály kezeli az adatokat (asztalok, időpontok, foglalások)
        private AdatokLekerese adatokKezelo;

        // Ez jelzi, hogy van-e mentetlen változás
        private bool vanMentetlenValtozas = false;

        // Konstruktor - itt inicializáljuk az adatkezelőt
        public Form1()
        {
            InitializeComponent();
            adatokKezelo = new AdatokLekerese();
        }

        // Form betöltésekor automatikusan betöltjük az adatokat az API-ból
        private async void Form1_Load(object sender, EventArgs e)
        {
            await AdatokBetolteseAPIbol();
        }

        // ============================================
        // ADATOK BETÖLTÉSE AZ API-BÓL
        // ============================================
        /// <summary>
        /// Betölti az adatokat az API-ból (asztalok, időpontok, foglalások)
        /// Ha nincs adat vagy az API nem elérhető, üres táblát mutat
        /// </summary>
        private async Task AdatokBetolteseAPIbol()
        {
            // Először töröljük az összes adatot, hogy biztosan ne legyen beégetett adat
            adatokKezelo.adatok.Clear();
            adatokKezelo.asztalKapacitasok.Clear();
            
            try
            {
                labelStatus.Text = "⏳ Adatok betöltése az API-ból...";
                labelStatus.ForeColor = Color.Orange;

                // 1. LÉPÉS: Asztalok lekérése az API-ból
                var asztalEredmeny = await adatokKezelo.AsztalokLekereseAPIbol();
                
                if (!asztalEredmeny.Sikeres)
                {
                    // Ha nem sikerült, NEM töltünk be semmilyen adatot
                    // Csak hibaüzenetet mutatunk
                    string hibaUzenet = "API nem elérhető: " + adatokKezelo.UtolsoHiba;
                    labelStatus.Text = "❌ " + hibaUzenet;
                    labelStatus.ForeColor = Color.Red;
                    
                    // Üres táblázat (nincs oszlop, nincs sor)
                    dataGridView1.Columns.Clear();
                    dataGridView1.Rows.Clear();
                    comboBoxAsztalTorlendo.Items.Clear();
                    comboBoxIdopontTorlendo.Items.Clear();
                    vanMentetlenValtozas = false;
                    
                    // Részletes hibaüzenet
                    MessageBox.Show(
                        "Az API nem elérhető!\n\n" +
                        "Hiba: " + adatokKezelo.UtolsoHiba + "\n\n" +
                        "Ellenőrizd:\n" +
                        "1. Fut-e a Backend? (http://localhost:8000)\n" +
                        "2. Fut-e a MySQL? (XAMPP)\n" +
                        "3. Létre van-e hozva az 'asztalfoglalas' adatbázis?\n\n" +
                        "Az alkalmazás üres táblázattal folytatja.\n" +
                        "Nincs helyi adat - minden adat az API-ból jön.",
                        "API nem elérhető",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Warning);
                    return;
                }

                // 2. LÉPÉS: Időpontok lekérése az API-ból
                var idopontEredmeny = await adatokKezelo.IdopontokLekereseAPIbol();
                
                if (idopontEredmeny.Sikeres)
                {
                    int idopontokSzama = adatokKezelo.adatok.Count;
                    int asztalokSzama = adatokKezelo.asztalKapacitasok.Count;
                    labelStatus.Text = "✅ Adatok betöltve az API-ból (" + asztalokSzama + " asztal, " + idopontokSzama + " időpont)";
                    labelStatus.ForeColor = Color.LightGreen;
                }
                else
                {
                    // Ha nincs időpont az API-ban, üres táblát mutatunk
                    int asztalokSzama = adatokKezelo.asztalKapacitasok.Count;
                    labelStatus.Text = "✅ Asztalok betöltve (" + asztalokSzama + " asztal), nincs időpont az adatbázisban";
                    labelStatus.ForeColor = Color.LightGreen;
                }

                // 3. LÉPÉS: Foglalások lekérése (mai napra)
                string maiDatum = DateTime.Now.ToString("yyyy-MM-dd");
                var foglalasEredmeny = await adatokKezelo.FoglalasokLekereseAPIbol(maiDatum);
                
                if (foglalasEredmeny.Sikeres)
                {
                    List<FoglalasDto> foglalasok = (List<FoglalasDto>)foglalasEredmeny.Eredmeny;
                    if (foglalasok != null && foglalasok.Count > 0)
                    {
                        FrissitElerhetosegekFoglalasokAlapjan(foglalasok);
                    }
                }
            }
            catch (Exception ex)
            {
                // Hiba esetén töröljük az összes adatot, hogy biztosan ne legyen régi adat
                adatokKezelo.adatok.Clear();
                adatokKezelo.asztalKapacitasok.Clear();
                
                // Hiba esetén NEM töltünk be semmilyen adatot
                // Csak hibaüzenetet mutatunk
                string hibaUzenet = "API hiba: " + ex.Message;
                labelStatus.Text = "❌ " + hibaUzenet;
                labelStatus.ForeColor = Color.Red;
                
                // Üres táblázat (nincs oszlop, nincs sor)
                dataGridView1.Columns.Clear();
                dataGridView1.Rows.Clear();
                comboBoxAsztalTorlendo.Items.Clear();
                comboBoxIdopontTorlendo.Items.Clear();
                vanMentetlenValtozas = false;
                
                // Részletes hibaüzenet
                MessageBox.Show(
                    "Hiba történt az API elérésekor!\n\n" +
                    "Hiba részletek: " + ex.Message + "\n\n" +
                    "Ellenőrizd:\n" +
                    "1. Fut-e a Backend? (http://localhost:8000)\n" +
                    "2. Fut-e a MySQL? (XAMPP)\n" +
                    "3. Létre van-e hozva az 'asztalfoglalas' adatbázis?\n\n" +
                    "Az alkalmazás üres táblázattal folytatja.\n" +
                    "Nincs helyi adat - minden adat az API-ból jön.",
                    "API hiba",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
                return;
            }

            // Grid és ComboBox-ok frissítése
            GridBeallitasa();
            GridFrissitese();
            ComboBoxokFrissitese();
            vanMentetlenValtozas = false;
        }

        // ============================================
        // FOGLALÁSOK ALAPJÁN FRISSÍTÉS
        // ============================================
        /// <summary>
        /// A foglalások alapján beállítja, melyik asztal foglalt
        /// </summary>
        private void FrissitElerhetosegekFoglalasokAlapjan(List<FoglalasDto> foglalasok)
        {
            // Először minden asztalt elérhetőnek jelölünk
            foreach (var idopont in adatokKezelo.adatok)
            {
                for (int i = 0; i < idopont.asztal.Count; i++)
                {
                    idopont.asztal[i] = true; // true = szabad
                }
            }

            // Aztán a foglalások alapján beállítjuk a foglaltakat
            foreach (var foglalas in foglalasok)
            {
                // Az asztal ID-ja 1-től kezdődik, de az index 0-tól
                int asztalIndex = foglalas.AsztalId - 1;
                
                // Ellenőrizzük, hogy érvényes az index
                if (asztalIndex >= 0 && asztalIndex < adatokKezelo.SzamolAsztalokSzama())
                {
                    // A foglalás dátumát összehasonlítjuk a mai dátummal
                    DateTime foglalasDatum = foglalas.FoglalasDatum.Date;
                    DateTime maiDatum = DateTime.Now.Date;
                    
                    if (foglalasDatum == maiDatum)
                    {
                        // Ha a mai napra van foglalás, beállítjuk foglaltnak
                        foreach (var idopont in adatokKezelo.adatok)
                        {
                            if (asztalIndex < idopont.asztal.Count)
                            {
                                idopont.asztal[asztalIndex] = false; // false = foglalt
                            }
                        }
                    }
                }
            }
        }

        // ============================================
        // GRID BEÁLLÍTÁSA ÉS FRISSÍTÉSE
        // ============================================
        /// <summary>
        /// Beállítja a grid oszlopait (asztalok)
        /// </summary>
        private void GridBeallitasa()
        {
            // Töröljük a régi oszlopokat
            dataGridView1.Columns.Clear();
            
            // Grid beállítások
            dataGridView1.AllowUserToAddRows = false;
            dataGridView1.AllowUserToDeleteRows = false;
            dataGridView1.SelectionMode = DataGridViewSelectionMode.CellSelect;
            dataGridView1.MultiSelect = false;
            dataGridView1.RowHeadersVisible = true;
            dataGridView1.RowHeadersWidth = 120;
            dataGridView1.DefaultCellStyle.Font = new Font("Segoe UI", 9);
            dataGridView1.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 9, FontStyle.Bold);
            dataGridView1.ColumnHeadersDefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;

            // Asztal oszlopok hozzáadása
            int asztalokSzama = adatokKezelo.SzamolAsztalokSzama();
            for (int i = 0; i < asztalokSzama; i++)
            {
                // Kapacitás lekérése - csak az API-ból érkező adatokkal
                int kapacitas = 0; // Ha nincs adat, 0-t használunk
                if (i < adatokKezelo.asztalKapacitasok.Count)
                {
                    kapacitas = adatokKezelo.asztalKapacitasok[i];
                }

                // Új oszlop létrehozása
                DataGridViewTextBoxColumn oszlop = new DataGridViewTextBoxColumn();
                oszlop.Name = "asztal_" + (i + 1);
                oszlop.HeaderText = "Asztal " + (i + 1) + "\n(" + kapacitas + " fő)";
                oszlop.Width = 100;
                oszlop.ReadOnly = true;
                oszlop.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                dataGridView1.Columns.Add(oszlop);
            }
        }

        /// <summary>
        /// Feltölti a grid-et az adatokkal
        /// </summary>
        private void GridFrissitese()
        {
            // Töröljük a régi sorokat
            dataGridView1.Rows.Clear();
            
            // Ha nincs időpont, üres táblát mutatunk
            if (adatokKezelo.adatok.Count == 0)
            {
                return;
            }
            
            // Minden időponthoz hozzáadunk egy sort
            foreach (var idopont in adatokKezelo.adatok)
            {
                int sorIndex = dataGridView1.Rows.Add();
                dataGridView1.Rows[sorIndex].HeaderCell.Value = idopont.ido;
                dataGridView1.Rows[sorIndex].Height = 35;

                // Minden asztalhoz beállítjuk a színt
                for (int j = 0; j < idopont.asztal.Count && j < dataGridView1.Columns.Count; j++)
                {
                    bool elerheto = idopont.asztal[j];
                    DataGridViewCell cella = dataGridView1.Rows[sorIndex].Cells[j];
                    
                    if (elerheto)
                    {
                        // Zöld = szabad
                        cella.Style.BackColor = Color.FromArgb(40, 167, 69);
                        cella.Value = "Szabad";
                        cella.Style.ForeColor = Color.White;
                    }
                    else
                    {
                        // Piros = foglalt
                        cella.Style.BackColor = Color.FromArgb(220, 53, 69);
                        cella.Value = "Foglalt";
                        cella.Style.ForeColor = Color.White;
                    }
                    cella.Style.SelectionBackColor = cella.Style.BackColor;
                    cella.Style.SelectionForeColor = cella.Style.ForeColor;
                }
            }
        }

        /// <summary>
        /// Frissíti a ComboBox-okat (asztal és időpont törléshez)
        /// </summary>
        private void ComboBoxokFrissitese()
        {
            // Asztal törlés ComboBox
            comboBoxAsztalTorlendo.Items.Clear();
            int asztalokSzama = adatokKezelo.SzamolAsztalokSzama();
            for (int i = 0; i < asztalokSzama; i++)
            {
                int kapacitas = 0; // Ha nincs adat, 0-t használunk
                if (i < adatokKezelo.asztalKapacitasok.Count)
                {
                    kapacitas = adatokKezelo.asztalKapacitasok[i];
                }
                comboBoxAsztalTorlendo.Items.Add("Asztal " + (i + 1) + " (" + kapacitas + " fő)");
            }

            // Időpont törlés ComboBox
            comboBoxIdopontTorlendo.Items.Clear();
            foreach (var idopont in adatokKezelo.adatok)
            {
                comboBoxIdopontTorlendo.Items.Add(idopont.ido);
            }
        }

        // ============================================
        // CELLÁK KEZELÉSE
        // ============================================
        /// <summary>
        /// Cella kattintáskor vált a foglalás állapota (szabad <-> foglalt)
        /// </summary>
        private void dataGridView1_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            // Ellenőrizzük, hogy érvényes cellára kattintottunk
            if (e.RowIndex < 0 || e.ColumnIndex < 0)
                return;

            // Váltjuk a foglalás állapotát
            var eredmeny = adatokKezelo.FoglalasValtoztatasa(e.RowIndex, e.ColumnIndex);
            
            if (eredmeny.Sikeres)
            {
                bool ujElerheto = (bool)eredmeny.Eredmeny;
                DataGridViewCell cella = dataGridView1.Rows[e.RowIndex].Cells[e.ColumnIndex];
                
                if (ujElerheto)
                {
                    // Szabad
                    cella.Style.BackColor = Color.FromArgb(40, 167, 69);
                    cella.Value = "Szabad";
                }
                else
                {
                    // Foglalt
                    cella.Style.BackColor = Color.FromArgb(220, 53, 69);
                    cella.Value = "Foglalt";
                }
                cella.Style.SelectionBackColor = cella.Style.BackColor;
                
                vanMentetlenValtozas = true;
                labelStatus.Text = "⚠️ Mentetlen változások vannak!";
                labelStatus.ForeColor = Color.Orange;
            }
        }

        // ============================================
        // ASZTAL HOZZÁADÁSA
        // ============================================
        /// <summary>
        /// Új asztal hozzáadása (gomb kattintás)
        /// </summary>
        private async void btnAsztalHozzaad_Click(object sender, EventArgs e)
        {
            // Kapacitás bekérése egy ablakban
            Form inputAblak = new Form();
            inputAblak.Width = 350;
            inputAblak.Height = 200;
            inputAblak.Text = "Új asztal hozzáadása";
            inputAblak.StartPosition = FormStartPosition.CenterParent;
            inputAblak.FormBorderStyle = FormBorderStyle.FixedDialog;
            inputAblak.MaximizeBox = false;
            inputAblak.MinimizeBox = false;

            Label label = new Label();
            label.Left = 20;
            label.Top = 20;
            label.Width = 300;
            label.Text = "Hány személyes legyen az új asztal?";
            label.Font = new Font("Segoe UI", 10);
            
            NumericUpDown numericKapacitas = new NumericUpDown();
            numericKapacitas.Left = 20;
            numericKapacitas.Top = 55;
            numericKapacitas.Width = 290;
            numericKapacitas.Height = 30;
            numericKapacitas.Minimum = 1;
            numericKapacitas.Maximum = 20;
            numericKapacitas.Value = 4;
            numericKapacitas.Font = new Font("Segoe UI", 12);
            
            Label infoLabel = new Label();
            infoLabel.Left = 20;
            infoLabel.Top = 90;
            infoLabel.Width = 300;
            infoLabel.Text = "Az új asztal: Asztal " + (adatokKezelo.SzamolAsztalokSzama() + 1);
            infoLabel.Font = new Font("Segoe UI", 9, FontStyle.Italic);
            infoLabel.ForeColor = Color.Gray;
            
            Button okGomb = new Button();
            okGomb.Text = "Hozzáadás";
            okGomb.Left = 100;
            okGomb.Width = 100;
            okGomb.Top = 120;
            okGomb.DialogResult = DialogResult.OK;
            okGomb.BackColor = Color.FromArgb(40, 167, 69);
            okGomb.ForeColor = Color.White;
            okGomb.FlatStyle = FlatStyle.Flat;
            
            Button megseGomb = new Button();
            megseGomb.Text = "Mégse";
            megseGomb.Left = 210;
            megseGomb.Width = 100;
            megseGomb.Top = 120;
            megseGomb.DialogResult = DialogResult.Cancel;

            inputAblak.Controls.Add(label);
            inputAblak.Controls.Add(numericKapacitas);
            inputAblak.Controls.Add(infoLabel);
            inputAblak.Controls.Add(okGomb);
            inputAblak.Controls.Add(megseGomb);
            inputAblak.AcceptButton = okGomb;
            inputAblak.CancelButton = megseGomb;

            if (inputAblak.ShowDialog() == DialogResult.OK)
            {
                int kapacitas = (int)numericKapacitas.Value;
                
                // 1. Hozzáadjuk lokálisan
                var eredmeny = adatokKezelo.AsztalHozzaadasa(kapacitas);
                
                if (eredmeny.Sikeres)
                {
                    // 2. Mentjük az API-ba
                    var apiEredmeny = await adatokKezelo.AsztalMenteseAPIba(kapacitas, 1);
                    
                    if (apiEredmeny.Sikeres)
                    {
                        GridBeallitasa();
                        GridFrissitese();
                        ComboBoxokFrissitese();
                        vanMentetlenValtozas = false;
                        labelStatus.Text = "✅ Asztal hozzáadva és mentve az API-ba!";
                        labelStatus.ForeColor = Color.LightGreen;
                    }
                    else
                    {
                        vanMentetlenValtozas = true;
                        labelStatus.Text = "⚠️ Asztal hozzáadva, de API mentés sikertelen!";
                        labelStatus.ForeColor = Color.Orange;
                    }
                }
                else
                {
                    MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        // ============================================
        // ASZTAL TÖRLÉSE
        // ============================================
        /// <summary>
        /// Asztal törlése (gomb kattintás)
        /// </summary>
        private async void btnAsztalTorol_Click(object sender, EventArgs e)
        {
            if (comboBoxAsztalTorlendo.SelectedIndex < 0)
            {
                MessageBox.Show("Válassz ki egy asztalt a törléshez!", 
                    "Nincs kiválasztás", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string kivalasztott = comboBoxAsztalTorlendo.SelectedItem.ToString();
            DialogResult megerosites = MessageBox.Show(
                "Biztosan törölni szeretnéd a következő asztalt?\n\n" + kivalasztott + "\n\nEz a művelet nem vonható vissza!",
                "Törlés megerősítése",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning);

            if (megerosites == DialogResult.Yes)
            {
                int asztalIndex = comboBoxAsztalTorlendo.SelectedIndex;
                int asztalId = asztalIndex + 1; // Az ID 1-től kezdődik
                
                // 1. Töröljük lokálisan
                var eredmeny = adatokKezelo.AsztalEltavolitasa(asztalIndex);
                
                if (eredmeny.Sikeres)
                {
                    // 2. Töröljük az API-ból
                    var apiEredmeny = await adatokKezelo.AsztalTorleseAPIbol(asztalId);
                    
                    if (apiEredmeny.Sikeres)
                    {
                        GridBeallitasa();
                        GridFrissitese();
                        ComboBoxokFrissitese();
                        vanMentetlenValtozas = false;
                        labelStatus.Text = "✅ Asztal törölve az API-ból!";
                        labelStatus.ForeColor = Color.LightGreen;
                    }
                    else
                    {
                        vanMentetlenValtozas = true;
                        labelStatus.Text = "⚠️ Asztal törölve, de API törlés sikertelen!";
                        labelStatus.ForeColor = Color.Orange;
                    }
                }
                else
                {
                    MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        // ============================================
        // IDŐPONT HOZZÁADÁSA
        // ============================================
        /// <summary>
        /// Új időpont hozzáadása (gomb kattintás)
        /// Szabadon beírhatjuk az időpontot
        /// </summary>
        private async void btnIdopontHozzaad_Click(object sender, EventArgs e)
        {
            // Ablak létrehozása időpont beírásához
            Form inputAblak = new Form();
            inputAblak.Width = 400;
            inputAblak.Height = 200;
            inputAblak.Text = "Új időpont hozzáadása";
            inputAblak.StartPosition = FormStartPosition.CenterParent;
            inputAblak.FormBorderStyle = FormBorderStyle.FixedDialog;
            inputAblak.MaximizeBox = false;
            inputAblak.MinimizeBox = false;

            Label label = new Label();
            label.Left = 20;
            label.Top = 20;
            label.Width = 360;
            label.Text = "Add meg az időpontot (pl: 9:00-10:00):";
            label.Font = new Font("Segoe UI", 10);
            
            TextBox textBoxIdopont = new TextBox();
            textBoxIdopont.Left = 20;
            textBoxIdopont.Top = 50;
            textBoxIdopont.Width = 340;
            textBoxIdopont.Height = 30;
            textBoxIdopont.Font = new Font("Segoe UI", 11);
            textBoxIdopont.PlaceholderText = "9:00-10:00";
            
            Label infoLabel = new Label();
            infoLabel.Left = 20;
            infoLabel.Top = 90;
            infoLabel.Width = 360;
            infoLabel.Text = "Formátum: ÓÓ:PP-ÓÓ:PP (pl: 9:00-10:00)";
            infoLabel.Font = new Font("Segoe UI", 9, FontStyle.Italic);
            infoLabel.ForeColor = Color.Gray;
            
            Button okGomb = new Button();
            okGomb.Text = "Hozzáadás";
            okGomb.Left = 120;
            okGomb.Width = 100;
            okGomb.Top = 120;
            okGomb.DialogResult = DialogResult.OK;
            okGomb.BackColor = Color.FromArgb(40, 167, 69);
            okGomb.ForeColor = Color.White;
            okGomb.FlatStyle = FlatStyle.Flat;
            
            Button megseGomb = new Button();
            megseGomb.Text = "Mégse";
            megseGomb.Left = 230;
            megseGomb.Width = 100;
            megseGomb.Top = 120;
            megseGomb.DialogResult = DialogResult.Cancel;

            inputAblak.Controls.Add(label);
            inputAblak.Controls.Add(textBoxIdopont);
            inputAblak.Controls.Add(infoLabel);
            inputAblak.Controls.Add(okGomb);
            inputAblak.Controls.Add(megseGomb);
            inputAblak.AcceptButton = okGomb;
            inputAblak.CancelButton = megseGomb;

            if (inputAblak.ShowDialog() == DialogResult.OK)
            {
                string ujIdopont = textBoxIdopont.Text.Trim();
                
                // Ellenőrizzük, hogy nem üres
                if (string.IsNullOrEmpty(ujIdopont))
                {
                    MessageBox.Show("Az időpont nem lehet üres!", "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
                
                // Ellenőrizzük, hogy nincs-e már ilyen időpont
                bool marVan = false;
                foreach (var idopont in adatokKezelo.adatok)
                {
                    if (idopont.ido == ujIdopont)
                    {
                        marVan = true;
                        break;
                    }
                }
                
                if (marVan)
                {
                    MessageBox.Show("Ez az időpont már létezik!", "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
                
                // 1. Hozzáadjuk lokálisan
                var eredmeny = adatokKezelo.IdopontHozzaadasa(ujIdopont);
                
                if (eredmeny.Sikeres)
                {
                    // 2. Mentjük az API-ba
                    // Az időpontot dátum-idő formátumban kell menteni
                    // Egyszerűsítve: mai dátum + időpont kezdete
                    string[] reszek = ujIdopont.Split('-');
                    if (reszek.Length == 2)
                    {
                        string kezdoIdo = reszek[0].Trim();
                        string[] kezdoReszek = kezdoIdo.Split(':');
                        if (kezdoReszek.Length == 2)
                        {
                            try
                            {
                                int ora = int.Parse(kezdoReszek[0]);
                                int perc = int.Parse(kezdoReszek[1]);
                                DateTime idopontDatum = DateTime.Now.Date.AddHours(ora).AddMinutes(perc);
                                
                                IdopontDto ujIdopontDto = new IdopontDto();
                                ujIdopontDto.FoglalasNapIdo = idopontDatum;
                                
                                var apiEredmeny = await adatokKezelo.IdopontMenteseAPIba(ujIdopontDto);
                                
                                if (apiEredmeny.Sikeres)
                                {
                                    GridFrissitese();
                                    ComboBoxokFrissitese();
                                    vanMentetlenValtozas = false;
                                    labelStatus.Text = "✅ Időpont hozzáadva és mentve az API-ba!";
                                    labelStatus.ForeColor = Color.LightGreen;
                                }
                                else
                                {
                                    vanMentetlenValtozas = true;
                                    labelStatus.Text = "⚠️ Időpont hozzáadva, de API mentés sikertelen!";
                                    labelStatus.ForeColor = Color.Orange;
                                }
                            }
                            catch
                            {
                                MessageBox.Show("Hibás időpont formátum! Használd: ÓÓ:PP-ÓÓ:PP", "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                            }
                        }
                    }
                }
                else
                {
                    MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        // ============================================
        // IDŐPONT TÖRLÉSE
        // ============================================
        /// <summary>
        /// Időpont törlése (gomb kattintás)
        /// </summary>
        private async void btnIdopontTorol_Click(object sender, EventArgs e)
        {
            if (comboBoxIdopontTorlendo.SelectedIndex < 0)
            {
                MessageBox.Show("Válassz ki egy időpontot a törléshez!", 
                    "Nincs kiválasztás", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string kivalasztott = comboBoxIdopontTorlendo.SelectedItem.ToString();
            DialogResult megerosites = MessageBox.Show(
                "Biztosan törölni szeretnéd a következő időpontot?\n\n" + kivalasztott + "\n\nEz a művelet nem vonható vissza!",
                "Törlés megerősítése",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning);

            if (megerosites == DialogResult.Yes)
            {
                int idopontIndex = comboBoxIdopontTorlendo.SelectedIndex;
                int idopontId = idopontIndex + 1; // Egyszerűsítve
                
                // 1. Töröljük lokálisan
                var eredmeny = adatokKezelo.IdopontEltavolitasa(idopontIndex);
                
                if (eredmeny.Sikeres)
                {
                    // 2. Töröljük az API-ból
                    var apiEredmeny = await adatokKezelo.IdopontTorleseAPIbol(idopontId);
                    
                    if (apiEredmeny.Sikeres)
                    {
                        GridFrissitese();
                        ComboBoxokFrissitese();
                        vanMentetlenValtozas = false;
                        labelStatus.Text = "✅ Időpont törölve az API-ból!";
                        labelStatus.ForeColor = Color.LightGreen;
                    }
                    else
                    {
                        vanMentetlenValtozas = true;
                        labelStatus.Text = "⚠️ Időpont törölve, de API törlés sikertelen!";
                        labelStatus.ForeColor = Color.Orange;
                    }
                }
                else
                {
                    MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        // ============================================
        // MENTÉS ÉS FRISSÍTÉS
        // ============================================
        /// <summary>
        /// Mentés gomb - adatok mentése az API-ba
        /// </summary>
        private async void btnMentes_Click(object sender, EventArgs e)
        {
            if (!vanMentetlenValtozas)
            {
                MessageBox.Show("Nincs mentendő változás!", 
                    "Mentés", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            DialogResult megerosites = MessageBox.Show(
                "Szeretnéd menteni a változásokat az adatbázisba?",
                "Mentés megerősítése",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question);

            if (megerosites == DialogResult.Yes)
            {
                try
                {
                    labelStatus.Text = "⏳ Mentés folyamatban...";
                    labelStatus.ForeColor = Color.Orange;
                    btnMentes.Enabled = false;

                    // 1. Asztalok mentése az API-ba
                    int sikeresAsztalok = 0;
                    for (int i = 0; i < adatokKezelo.asztalKapacitasok.Count; i++)
                    {
                        int asztalId = i + 1;
                        int kapacitas = adatokKezelo.asztalKapacitasok[i];
                        var eredmeny = await adatokKezelo.AsztalFrissiteseAPIban(asztalId, kapacitas, 1);
                        if (eredmeny.Sikeres)
                        {
                            sikeresAsztalok++;
                        }
                    }

                    // 2. Foglalások állapotának mentése (a grid-ben lévő állapotok alapján)
                    string maiDatum = DateTime.Now.ToString("yyyy-MM-dd");
                    var foglalasEredmeny = await adatokKezelo.FoglalasokAllapotanakMenteseAPIba(maiDatum);

                    vanMentetlenValtozas = false;
                    labelStatus.Text = "✅ Mentés sikeres!";
                    labelStatus.ForeColor = Color.LightGreen;
                    
                    string uzenet = "Adatok sikeresen mentve!\n\n";
                    uzenet += "Frissített asztalok: " + sikeresAsztalok + "\n";
                    if (foglalasEredmeny.Sikeres)
                    {
                        uzenet += foglalasEredmeny.Uzenet;
                    }
                    
                    MessageBox.Show(uzenet, "Mentés sikeres", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                catch (Exception ex)
                {
                    labelStatus.Text = "❌ Mentési hiba!";
                    labelStatus.ForeColor = Color.Red;
                    MessageBox.Show("Hiba történt a mentés során:\n" + ex.Message + "\n\nEllenőrizd, hogy a Backend fut-e!", 
                        "Mentési hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
                finally
                {
                    btnMentes.Enabled = true;
                }
            }
        }

        /// <summary>
        /// Frissítés gomb - adatok újratöltése az API-ból
        /// </summary>
        private async void btnFrissites_Click(object sender, EventArgs e)
        {
            if (vanMentetlenValtozas)
            {
                DialogResult megerosites = MessageBox.Show(
                    "Mentetlen változásaid vannak!\n\nBiztosan szeretnéd újratölteni az adatokat az API-ból?\nA változásaid elvesznek!",
                    "Figyelmeztetés",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Warning);

                if (megerosites != DialogResult.Yes)
                    return;
            }

            await AdatokBetolteseAPIbol();
            MessageBox.Show("Adatok frissítve!", "Frissítés", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        // ============================================
        // FORM BEZÁRÁSA
        // ============================================
        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (vanMentetlenValtozas)
            {
                DialogResult eredmeny = MessageBox.Show(
                    "Mentetlen változásaid vannak!\n\nSzeretned menteni kilépés előtt?",
                    "Mentetlen változások",
                    MessageBoxButtons.YesNoCancel,
                    MessageBoxIcon.Warning);

                if (eredmeny == DialogResult.Yes)
                {
                    btnMentes_Click(this, EventArgs.Empty);
                }
                else if (eredmeny == DialogResult.Cancel)
                {
                    e.Cancel = true;
                }
            }
            base.OnFormClosing(e);
        }
    }
}
