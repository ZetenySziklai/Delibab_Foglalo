using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using AdatokElerese;
using AdatokElerese.Models;

namespace AdminFelulet
{
    public partial class Form1 : Form
    {
        // Adatok kezelése
        private AdatokLekerese al;
        
        // Elérhető időpontok (választható lista)
        private readonly string[] elhetoIdopontok = {
            "8:00-9:00", "9:00-10:00", "10:00-11:00", "10:30-11:30",
            "11:00-12:00", "12:00-13:00", "12:30-13:30", "13:00-14:00",
            "13:30-14:30", "14:00-15:00", "15:00-16:00", "15:30-16:30",
            "16:00-17:00", "16:30-17:30", "17:00-18:00", "18:00-19:00",
            "18:30-19:30", "19:00-20:00", "19:30-20:30", "20:00-21:00",
            "20:30-21:30", "21:00-22:00", "21:30-22:30", "22:00-23:00"
        };

        // Változások követése
        private bool vanValtozas = false;

        public Form1()
        {
            InitializeComponent();
            al = new AdatokLekerese();
        }

        /// <summary>
        /// Form betöltésekor automatikusan betölti az adatokat
        /// </summary>
        private async void Form1_Load(object sender, EventArgs e)
        {
            await AdatokBetoltese();
        }

        /// <summary>
        /// Adatok betöltése az API-ból vagy helyi adatokkal
        /// </summary>
        private async Task AdatokBetoltese()
        {
            try
            {
                labelStatus.Text = "⏳ Adatok betöltése...";
                labelStatus.ForeColor = Color.Orange;

                // Próbáljuk meg az API-ból betölteni
                var eredmeny = await al.AsztalokLekereseAPIbol();
                
                if (eredmeny.Sikeres)
                {
                    labelStatus.Text = "✅ Adatok betöltve az API-ból";
                    labelStatus.ForeColor = Color.LightGreen;
                }
                else
                {
                    // Ha nincs API, helyi adatokat használunk
                    al.AlapAdatokLetrehozasa();
                    labelStatus.Text = "⚠️ Helyi adatok (API nem elérhető)";
                    labelStatus.ForeColor = Color.Yellow;
                }
            }
            catch (Exception)
            {
                // API hiba esetén helyi adatokat használunk
                al.AlapAdatokLetrehozasa();
                labelStatus.Text = "⚠️ Helyi adatok (API hiba)";
                labelStatus.ForeColor = Color.Yellow;
            }

            // Grid és ComboBox-ok frissítése
            GridBeallitasa();
            GridFrissitese();
            ComboBoxokFrissitese();
            vanValtozas = false;
        }

        /// <summary>
        /// Grid beállítása - oszlopok az asztalokhoz
        /// </summary>
        private void GridBeallitasa()
        {
            dataGridView1.Columns.Clear();
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
            int asztalokSzama = al.SzamolAsztalokSzama();
            for (int i = 0; i < asztalokSzama; i++)
            {
                int kapacitas = 4;
                if (i < al.asztalKapacitasok.Count)
                {
                    kapacitas = al.asztalKapacitasok[i];
                }

                DataGridViewTextBoxColumn oszlop = new DataGridViewTextBoxColumn();
                oszlop.Name = $"asztal_{i + 1}";
                oszlop.HeaderText = $"Asztal {i + 1}\n({kapacitas} fő)";
                oszlop.Width = 100;
                oszlop.ReadOnly = true;
                oszlop.DefaultCellStyle.Alignment = DataGridViewContentAlignment.MiddleCenter;
                dataGridView1.Columns.Add(oszlop);
            }
        }

        /// <summary>
        /// Grid feltöltése adatokkal
        /// </summary>
        private void GridFrissitese()
        {
            dataGridView1.Rows.Clear();
            
            foreach (var idopont in al.adatok)
            {
                int rowIndex = dataGridView1.Rows.Add();
                dataGridView1.Rows[rowIndex].HeaderCell.Value = idopont.ido;
                dataGridView1.Rows[rowIndex].Height = 35;

                for (int j = 0; j < idopont.asztal.Count && j < dataGridView1.Columns.Count; j++)
                {
                    bool elerheto = idopont.asztal[j];
                    DataGridViewCell cella = dataGridView1.Rows[rowIndex].Cells[j];
                    
                    if (elerheto)
                    {
                        cella.Style.BackColor = Color.FromArgb(40, 167, 69); // Zöld
                        cella.Value = "Szabad";
                        cella.Style.ForeColor = Color.White;
                    }
                    else
                    {
                        cella.Style.BackColor = Color.FromArgb(220, 53, 69); // Piros
                        cella.Value = "Foglalt";
                        cella.Style.ForeColor = Color.White;
                    }
                    cella.Style.SelectionBackColor = cella.Style.BackColor;
                    cella.Style.SelectionForeColor = cella.Style.ForeColor;
                }
            }
        }

        /// <summary>
        /// ComboBox-ok frissítése
        /// </summary>
        private void ComboBoxokFrissitese()
        {
            // Asztal törlés ComboBox
            comboBoxAsztalTorlendo.Items.Clear();
            int asztalokSzama = al.SzamolAsztalokSzama();
            for (int i = 0; i < asztalokSzama; i++)
            {
                int kapacitas = 4;
                if (i < al.asztalKapacitasok.Count)
                {
                    kapacitas = al.asztalKapacitasok[i];
                }
                comboBoxAsztalTorlendo.Items.Add($"Asztal {i + 1} ({kapacitas} fő)");
            }

            // Időpont törlés ComboBox
            comboBoxIdopontTorlendo.Items.Clear();
            foreach (var idopont in al.adatok)
            {
                comboBoxIdopontTorlendo.Items.Add(idopont.ido);
            }
        }

        /// <summary>
        /// Cella kattintás - foglalás váltás
        /// </summary>
        private void dataGridView1_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex < 0 || e.ColumnIndex < 0)
                return;

            var eredmeny = al.FoglalasValtoztatasa(e.RowIndex, e.ColumnIndex);
            
            if (eredmeny.Sikeres)
            {
                bool ujElerheto = (bool)eredmeny.Eredmeny;
                DataGridViewCell cella = dataGridView1.Rows[e.RowIndex].Cells[e.ColumnIndex];
                
                if (ujElerheto)
                {
                    cella.Style.BackColor = Color.FromArgb(40, 167, 69);
                    cella.Value = "Szabad";
                }
                else
                {
                    cella.Style.BackColor = Color.FromArgb(220, 53, 69);
                    cella.Value = "Foglalt";
                }
                cella.Style.SelectionBackColor = cella.Style.BackColor;
                
                vanValtozas = true;
                labelStatus.Text = "⚠️ Mentetlen változások vannak!";
                labelStatus.ForeColor = Color.Orange;
            }
        }

        /// <summary>
        /// + Asztal gomb - új asztal hozzáadása
        /// </summary>
        private void btnAsztalHozzaad_Click(object sender, EventArgs e)
        {
            // Kapacitás bekérése
            using (Form inputForm = new Form())
            {
                inputForm.Width = 350;
                inputForm.Height = 200;
                inputForm.Text = "Új asztal hozzáadása";
                inputForm.StartPosition = FormStartPosition.CenterParent;
                inputForm.FormBorderStyle = FormBorderStyle.FixedDialog;
                inputForm.MaximizeBox = false;
                inputForm.MinimizeBox = false;

                Label label = new Label() 
                { 
                    Left = 20, Top = 20, Width = 300, 
                    Text = "Hány személyes legyen az új asztal?",
                    Font = new Font("Segoe UI", 10)
                };
                
                NumericUpDown numericKapacitas = new NumericUpDown() 
                { 
                    Left = 20, Top = 55, Width = 290, Height = 30,
                    Minimum = 1, Maximum = 20, Value = 4,
                    Font = new Font("Segoe UI", 12)
                };
                
                Label infoLabel = new Label()
                {
                    Left = 20, Top = 90, Width = 300,
                    Text = $"Az új asztal: Asztal {al.SzamolAsztalokSzama() + 1}",
                    Font = new Font("Segoe UI", 9, FontStyle.Italic),
                    ForeColor = Color.Gray
                };
                
                Button okGomb = new Button() 
                { 
                    Text = "Hozzáadás", Left = 100, Width = 100, Top = 120, 
                    DialogResult = DialogResult.OK,
                    BackColor = Color.FromArgb(40, 167, 69),
                    ForeColor = Color.White,
                    FlatStyle = FlatStyle.Flat
                };
                
                Button megseGomb = new Button() 
                { 
                    Text = "Mégse", Left = 210, Width = 100, Top = 120, 
                    DialogResult = DialogResult.Cancel 
                };

                inputForm.Controls.Add(label);
                inputForm.Controls.Add(numericKapacitas);
                inputForm.Controls.Add(infoLabel);
                inputForm.Controls.Add(okGomb);
                inputForm.Controls.Add(megseGomb);
                inputForm.AcceptButton = okGomb;
                inputForm.CancelButton = megseGomb;

                if (inputForm.ShowDialog() == DialogResult.OK)
                {
                    int kapacitas = (int)numericKapacitas.Value;
                    var eredmeny = al.AsztalHozzaadasa(kapacitas);
                    
                    if (eredmeny.Sikeres)
                    {
                        GridBeallitasa();
                        GridFrissitese();
                        ComboBoxokFrissitese();
                        vanValtozas = true;
                        labelStatus.Text = $"✅ Asztal {al.SzamolAsztalokSzama()} hozzáadva ({kapacitas} fő)";
                        labelStatus.ForeColor = Color.LightGreen;
                    }
                    else
                    {
                        MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        /// <summary>
        /// - Asztal törlés gomb
        /// </summary>
        private void btnAsztalTorol_Click(object sender, EventArgs e)
        {
            if (comboBoxAsztalTorlendo.SelectedIndex < 0)
            {
                MessageBox.Show("Válassz ki egy asztalt a törléshez!", 
                    "Nincs kiválasztás", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string kivalasztott = comboBoxAsztalTorlendo.SelectedItem.ToString();
            DialogResult megerosites = MessageBox.Show(
                $"Biztosan törölni szeretnéd a következő asztalt?\n\n{kivalasztott}\n\nEz a művelet nem vonható vissza!",
                "Törlés megerősítése",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning);

            if (megerosites == DialogResult.Yes)
            {
                var eredmeny = al.AsztalEltavolitasa(comboBoxAsztalTorlendo.SelectedIndex);
                
                if (eredmeny.Sikeres)
                {
                    GridBeallitasa();
                    GridFrissitese();
                    ComboBoxokFrissitese();
                    vanValtozas = true;
                    labelStatus.Text = $"✅ {kivalasztott} törölve";
                    labelStatus.ForeColor = Color.LightGreen;
                }
                else
                {
                    MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        /// <summary>
        /// + Időpont gomb - új időpont hozzáadása
        /// </summary>
        private void btnIdopontHozzaad_Click(object sender, EventArgs e)
        {
            // Már létező időpontok
            List<string> letezoIdopontok = al.adatok.Select(a => a.ido).ToList();
            
            // Választható időpontok (amelyek még nincsenek)
            List<string> valaszthatoIdopontok = elhetoIdopontok
                .Where(ido => !letezoIdopontok.Contains(ido))
                .ToList();

            if (valaszthatoIdopontok.Count == 0)
            {
                MessageBox.Show("Minden lehetséges időpont már hozzá van adva!", 
                    "Nincs több időpont", MessageBoxButtons.OK, MessageBoxIcon.Information);
                return;
            }

            using (Form inputForm = new Form())
            {
                inputForm.Width = 350;
                inputForm.Height = 200;
                inputForm.Text = "Új időpont hozzáadása";
                inputForm.StartPosition = FormStartPosition.CenterParent;
                inputForm.FormBorderStyle = FormBorderStyle.FixedDialog;
                inputForm.MaximizeBox = false;
                inputForm.MinimizeBox = false;

                Label label = new Label() 
                { 
                    Left = 20, Top = 20, Width = 300, 
                    Text = "Válassz egy időpontot:",
                    Font = new Font("Segoe UI", 10)
                };
                
                ComboBox comboIdopont = new ComboBox() 
                { 
                    Left = 20, Top = 50, Width = 290,
                    DropDownStyle = ComboBoxStyle.DropDownList,
                    Font = new Font("Segoe UI", 11)
                };
                comboIdopont.Items.AddRange(valaszthatoIdopontok.ToArray());
                if (comboIdopont.Items.Count > 0)
                    comboIdopont.SelectedIndex = 0;
                
                Label infoLabel = new Label()
                {
                    Left = 20, Top = 85, Width = 300,
                    Text = $"Elérhető időpontok száma: {valaszthatoIdopontok.Count}",
                    Font = new Font("Segoe UI", 9, FontStyle.Italic),
                    ForeColor = Color.Gray
                };
                
                Button okGomb = new Button() 
                { 
                    Text = "Hozzáadás", Left = 100, Width = 100, Top = 120, 
                    DialogResult = DialogResult.OK,
                    BackColor = Color.FromArgb(40, 167, 69),
                    ForeColor = Color.White,
                    FlatStyle = FlatStyle.Flat
                };
                
                Button megseGomb = new Button() 
                { 
                    Text = "Mégse", Left = 210, Width = 100, Top = 120, 
                    DialogResult = DialogResult.Cancel 
                };

                inputForm.Controls.Add(label);
                inputForm.Controls.Add(comboIdopont);
                inputForm.Controls.Add(infoLabel);
                inputForm.Controls.Add(okGomb);
                inputForm.Controls.Add(megseGomb);
                inputForm.AcceptButton = okGomb;
                inputForm.CancelButton = megseGomb;

                if (inputForm.ShowDialog() == DialogResult.OK && comboIdopont.SelectedItem != null)
                {
                    string ujIdopont = comboIdopont.SelectedItem.ToString();
                    var eredmeny = al.IdopontHozzaadasa(ujIdopont);
                    
                    if (eredmeny.Sikeres)
                    {
                        GridFrissitese();
                        ComboBoxokFrissitese();
                        vanValtozas = true;
                        labelStatus.Text = $"✅ Időpont hozzáadva: {ujIdopont}";
                        labelStatus.ForeColor = Color.LightGreen;
                    }
                    else
                    {
                        MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }

        /// <summary>
        /// - Időpont törlés gomb
        /// </summary>
        private void btnIdopontTorol_Click(object sender, EventArgs e)
        {
            if (comboBoxIdopontTorlendo.SelectedIndex < 0)
            {
                MessageBox.Show("Válassz ki egy időpontot a törléshez!", 
                    "Nincs kiválasztás", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string kivalasztott = comboBoxIdopontTorlendo.SelectedItem.ToString();
            DialogResult megerosites = MessageBox.Show(
                $"Biztosan törölni szeretnéd a következő időpontot?\n\n{kivalasztott}\n\nEz a művelet nem vonható vissza!",
                "Törlés megerősítése",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Warning);

            if (megerosites == DialogResult.Yes)
            {
                var eredmeny = al.IdopontEltavolitasa(comboBoxIdopontTorlendo.SelectedIndex);
                
                if (eredmeny.Sikeres)
                {
                    GridFrissitese();
                    ComboBoxokFrissitese();
                    vanValtozas = true;
                    labelStatus.Text = $"✅ Időpont törölve: {kivalasztott}";
                    labelStatus.ForeColor = Color.LightGreen;
                }
                else
                {
                    MessageBox.Show(eredmeny.Uzenet, "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        /// <summary>
        /// Mentés gomb - adatok mentése az API-ba
        /// </summary>
        private async void btnMentes_Click(object sender, EventArgs e)
        {
            if (!vanValtozas)
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

                    // Asztalok mentése az API-ba
                    int sikeresAsztalok = 0;
                    for (int i = 0; i < al.asztalKapacitasok.Count; i++)
                    {
                        var eredmeny = await al.AsztalFrissiteseAPIban(i + 1, al.asztalKapacitasok[i], 1);
                        if (eredmeny.Sikeres)
                        {
                            sikeresAsztalok++;
                        }
                    }

                    // Foglalások mentése (később implementálható részletesebben)
                    // Jelenleg az asztal állapotokat mentjük

                    vanValtozas = false;
                    labelStatus.Text = $"✅ Mentés sikeres! ({sikeresAsztalok} asztal frissítve)";
                    labelStatus.ForeColor = Color.LightGreen;
                    
                    MessageBox.Show($"Adatok sikeresen mentve!\n\nFrissített asztalok: {sikeresAsztalok}", 
                        "Mentés sikeres", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                catch (Exception ex)
                {
                    labelStatus.Text = "❌ Mentési hiba!";
                    labelStatus.ForeColor = Color.Red;
                    MessageBox.Show($"Hiba történt a mentés során:\n{ex.Message}\n\nEllenőrizd, hogy a Backend fut-e!", 
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
            if (vanValtozas)
            {
                DialogResult megerosites = MessageBox.Show(
                    "Mentetlen változásaid vannak!\n\nBiztosan szeretnéd újratölteni az adatokat az API-ból?\nA változásaid elvesznek!",
                    "Figyelmeztetés",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Warning);

                if (megerosites != DialogResult.Yes)
                    return;
            }

            await AdatokBetoltese();
            MessageBox.Show("Adatok frissítve!", "Frissítés", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        /// <summary>
        /// TESZT EXPORT gomb - adatok kiiratása fájlba (IDEIGLENES - TÖRÖLHETŐ!)
        /// </summary>
        private void btnTesztExport_Click(object sender, EventArgs e)
        {
            try
            {
                // Teszt kiiratás meghívása
                TEMP_TesztKiiratas_TOROLHETO.MindentKiir(al);
                
                string mappa = System.IO.Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
                    "DelibabTeszt");
                
                MessageBox.Show(
                    $"Teszt export sikeres!\n\nA fájlok ide kerültek:\n{mappa}\n\n" +
                    "Létrehozott fájlok:\n" +
                    "• asztalok_*.txt\n" +
                    "• idopontok_es_foglaltsag_*.txt\n" +
                    "• api_export_*.json\n" +
                    "• OSSZEFOGLALO_*.txt",
                    "Teszt Export",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Information);

                // Mappa megnyitása
                System.Diagnostics.Process.Start("explorer.exe", mappa);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Hiba a teszt export során:\n{ex.Message}",
                    "Hiba", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Form bezáráskor figyelmeztetés mentetlen változásokra
        /// </summary>
        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (vanValtozas)
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
