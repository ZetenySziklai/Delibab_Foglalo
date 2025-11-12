using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Windows.Forms;

namespace AdminFelulet
{
    public partial class Form1 : Form
    {
        static AdatokLekerese al = new AdatokLekerese("teszt_adatok.txt");
        public Form1()
        {
            InitializeComponent();
        }
        private void HonapokComboBox(AdatokLekerese al)
        {
            comboBox1.Items.Add("Január");
        }
        private void NapokComboBox(AdatokLekerese al)
        {
            comboBox2.Items.Add("Hétfő");
        }
        private void SorFeltoltesDGV(AdatokLekerese al)
        {
            dataGridView1.RowCount = al.adatok.Count;
            for(int i = 0; i < al.adatok.Count; i++)
            {
                AdatokBeirasaDGV(i, al);
            }
        }
        private void AdatokBeirasaDGV(int i,AdatokLekerese al)
        {
            dataGridView1.Rows[i].HeaderCell.Value = al.adatok[i].ido;
            for (int j = 0; j < al.lista[i].asztal; j++)
            {
                if(al.adatok[i].asztal[j] == true)
                {
                    dataGridView1.Rows[i].Cells[j + 1].Style.BackColor = Color.Green;
                }
                else 
                { 
                    dataGridView1.Rows[i].Cells[j + 1].Style.BackColor = Color.Red;
                }
            }
        }

        private void button5_Click(object sender, EventArgs e)
        {
            getData();
        }

        public void getData()
        {
            string kapcsolat = "server=localhost;uid=root,pwd=root;database=asztalfoglalas;";
            MySqlConnection kap = new MySqlConnection(kapcsolat);
            kap.Open();
            string query = @"SELECT 
                    a.id AS asztal_id,
                    a.foglalt,
                    u.nev AS felhasznalo_nev,
                    u.email,
                    asztal.szam AS asztal_szam,
                    asztal.helyek
                 FROM asztalallapot a
                 INNER JOIN User u ON a.user_id = u.id
                 INNER JOIN Asztal asztal ON a.asztal_id = asztal.id
                 WHERE a.foglalt = true";
            MySqlCommand cmd = new MySqlCommand(query, kap);
            MySqlDataReader dr = cmd.ExecuteReader();
            DataTable dt = new DataTable();
            dt.Load(dr);
            dataGridView1.DataSource = dt;
        }
    }
}
