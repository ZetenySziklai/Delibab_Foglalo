
namespace AdminFelulet
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.panelHeader = new System.Windows.Forms.Panel();
            this.labelCim = new System.Windows.Forms.Label();
            this.labelStatus = new System.Windows.Forms.Label();
            this.btnTesztExport = new System.Windows.Forms.Button();
            this.panelGombok = new System.Windows.Forms.Panel();
            this.groupBoxAsztal = new System.Windows.Forms.GroupBox();
            this.btnAsztalHozzaad = new System.Windows.Forms.Button();
            this.btnAsztalTorol = new System.Windows.Forms.Button();
            this.comboBoxAsztalTorlendo = new System.Windows.Forms.ComboBox();
            this.groupBoxIdopont = new System.Windows.Forms.GroupBox();
            this.btnIdopontHozzaad = new System.Windows.Forms.Button();
            this.btnIdopontTorol = new System.Windows.Forms.Button();
            this.comboBoxIdopontTorlendo = new System.Windows.Forms.ComboBox();
            this.groupBoxMentes = new System.Windows.Forms.GroupBox();
            this.btnMentes = new System.Windows.Forms.Button();
            this.btnFrissites = new System.Windows.Forms.Button();
            this.panelGrid = new System.Windows.Forms.Panel();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.panelHeader.SuspendLayout();
            this.panelGombok.SuspendLayout();
            this.groupBoxAsztal.SuspendLayout();
            this.groupBoxIdopont.SuspendLayout();
            this.groupBoxMentes.SuspendLayout();
            this.panelGrid.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            this.SuspendLayout();
            // 
            // panelHeader
            // 
            this.panelHeader.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(45)))), ((int)(((byte)(48)))));
            this.panelHeader.Controls.Add(this.labelCim);
            this.panelHeader.Controls.Add(this.btnTesztExport);
            this.panelHeader.Controls.Add(this.labelStatus);
            this.panelHeader.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelHeader.Location = new System.Drawing.Point(0, 0);
            this.panelHeader.Name = "panelHeader";
            this.panelHeader.Size = new System.Drawing.Size(1300, 60);
            this.panelHeader.TabIndex = 0;
            // 
            // labelCim
            // 
            this.labelCim.AutoSize = true;
            this.labelCim.Font = new System.Drawing.Font("Segoe UI", 18F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelCim.ForeColor = System.Drawing.Color.White;
            this.labelCim.Location = new System.Drawing.Point(20, 14);
            this.labelCim.Name = "labelCim";
            this.labelCim.Size = new System.Drawing.Size(380, 32);
            this.labelCim.TabIndex = 0;
            this.labelCim.Text = "🍽️ Délibáb Étterem - Admin";
            // 
            // labelStatus
            // 
            this.labelStatus.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.labelStatus.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.labelStatus.ForeColor = System.Drawing.Color.LightGray;
            this.labelStatus.Location = new System.Drawing.Point(900, 20);
            this.labelStatus.Name = "labelStatus";
            this.labelStatus.Size = new System.Drawing.Size(380, 23);
            this.labelStatus.TabIndex = 1;
            this.labelStatus.Text = "Betöltés...";
            this.labelStatus.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // btnTesztExport - IDEIGLENES TESZT GOMB (TÖRÖLHETŐ!)
            // 
            this.btnTesztExport.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(193)))), ((int)(((byte)(7)))));
            this.btnTesztExport.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnTesztExport.Font = new System.Drawing.Font("Segoe UI", 8F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.btnTesztExport.ForeColor = System.Drawing.Color.Black;
            this.btnTesztExport.Location = new System.Drawing.Point(450, 15);
            this.btnTesztExport.Name = "btnTesztExport";
            this.btnTesztExport.Size = new System.Drawing.Size(130, 30);
            this.btnTesztExport.TabIndex = 2;
            this.btnTesztExport.Text = "📄 TESZT EXPORT";
            this.btnTesztExport.UseVisualStyleBackColor = false;
            this.btnTesztExport.Click += new System.EventHandler(this.btnTesztExport_Click);
            // 
            // panelGombok
            // 
            this.panelGombok.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(240)))), ((int)(((byte)(240)))), ((int)(((byte)(240)))));
            this.panelGombok.Controls.Add(this.groupBoxAsztal);
            this.panelGombok.Controls.Add(this.groupBoxIdopont);
            this.panelGombok.Controls.Add(this.groupBoxMentes);
            this.panelGombok.Dock = System.Windows.Forms.DockStyle.Top;
            this.panelGombok.Location = new System.Drawing.Point(0, 60);
            this.panelGombok.Name = "panelGombok";
            this.panelGombok.Size = new System.Drawing.Size(1300, 100);
            this.panelGombok.TabIndex = 1;
            // 
            // groupBoxAsztal
            // 
            this.groupBoxAsztal.Controls.Add(this.btnAsztalHozzaad);
            this.groupBoxAsztal.Controls.Add(this.btnAsztalTorol);
            this.groupBoxAsztal.Controls.Add(this.comboBoxAsztalTorlendo);
            this.groupBoxAsztal.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.groupBoxAsztal.Location = new System.Drawing.Point(20, 10);
            this.groupBoxAsztal.Name = "groupBoxAsztal";
            this.groupBoxAsztal.Size = new System.Drawing.Size(380, 80);
            this.groupBoxAsztal.TabIndex = 0;
            this.groupBoxAsztal.TabStop = false;
            this.groupBoxAsztal.Text = "🪑 Asztal kezelés";
            // 
            // btnAsztalHozzaad
            // 
            this.btnAsztalHozzaad.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(40)))), ((int)(((byte)(167)))), ((int)(((byte)(69)))));
            this.btnAsztalHozzaad.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAsztalHozzaad.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.btnAsztalHozzaad.ForeColor = System.Drawing.Color.White;
            this.btnAsztalHozzaad.Location = new System.Drawing.Point(15, 30);
            this.btnAsztalHozzaad.Name = "btnAsztalHozzaad";
            this.btnAsztalHozzaad.Size = new System.Drawing.Size(100, 35);
            this.btnAsztalHozzaad.TabIndex = 0;
            this.btnAsztalHozzaad.Text = "+ Asztal";
            this.btnAsztalHozzaad.UseVisualStyleBackColor = false;
            this.btnAsztalHozzaad.Click += new System.EventHandler(this.btnAsztalHozzaad_Click);
            // 
            // btnAsztalTorol
            // 
            this.btnAsztalTorol.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(53)))), ((int)(((byte)(69)))));
            this.btnAsztalTorol.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAsztalTorol.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.btnAsztalTorol.ForeColor = System.Drawing.Color.White;
            this.btnAsztalTorol.Location = new System.Drawing.Point(265, 30);
            this.btnAsztalTorol.Name = "btnAsztalTorol";
            this.btnAsztalTorol.Size = new System.Drawing.Size(100, 35);
            this.btnAsztalTorol.TabIndex = 1;
            this.btnAsztalTorol.Text = "- Törlés";
            this.btnAsztalTorol.UseVisualStyleBackColor = false;
            this.btnAsztalTorol.Click += new System.EventHandler(this.btnAsztalTorol_Click);
            // 
            // comboBoxAsztalTorlendo
            // 
            this.comboBoxAsztalTorlendo.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBoxAsztalTorlendo.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.comboBoxAsztalTorlendo.FormattingEnabled = true;
            this.comboBoxAsztalTorlendo.Location = new System.Drawing.Point(125, 33);
            this.comboBoxAsztalTorlendo.Name = "comboBoxAsztalTorlendo";
            this.comboBoxAsztalTorlendo.Size = new System.Drawing.Size(130, 28);
            this.comboBoxAsztalTorlendo.TabIndex = 2;
            // 
            // groupBoxIdopont
            // 
            this.groupBoxIdopont.Controls.Add(this.btnIdopontHozzaad);
            this.groupBoxIdopont.Controls.Add(this.btnIdopontTorol);
            this.groupBoxIdopont.Controls.Add(this.comboBoxIdopontTorlendo);
            this.groupBoxIdopont.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.groupBoxIdopont.Location = new System.Drawing.Point(420, 10);
            this.groupBoxIdopont.Name = "groupBoxIdopont";
            this.groupBoxIdopont.Size = new System.Drawing.Size(400, 80);
            this.groupBoxIdopont.TabIndex = 1;
            this.groupBoxIdopont.TabStop = false;
            this.groupBoxIdopont.Text = "🕐 Időpont kezelés";
            // 
            // btnIdopontHozzaad
            // 
            this.btnIdopontHozzaad.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(40)))), ((int)(((byte)(167)))), ((int)(((byte)(69)))));
            this.btnIdopontHozzaad.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIdopontHozzaad.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.btnIdopontHozzaad.ForeColor = System.Drawing.Color.White;
            this.btnIdopontHozzaad.Location = new System.Drawing.Point(15, 30);
            this.btnIdopontHozzaad.Name = "btnIdopontHozzaad";
            this.btnIdopontHozzaad.Size = new System.Drawing.Size(110, 35);
            this.btnIdopontHozzaad.TabIndex = 0;
            this.btnIdopontHozzaad.Text = "+ Időpont";
            this.btnIdopontHozzaad.UseVisualStyleBackColor = false;
            this.btnIdopontHozzaad.Click += new System.EventHandler(this.btnIdopontHozzaad_Click);
            // 
            // btnIdopontTorol
            // 
            this.btnIdopontTorol.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(220)))), ((int)(((byte)(53)))), ((int)(((byte)(69)))));
            this.btnIdopontTorol.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIdopontTorol.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.btnIdopontTorol.ForeColor = System.Drawing.Color.White;
            this.btnIdopontTorol.Location = new System.Drawing.Point(285, 30);
            this.btnIdopontTorol.Name = "btnIdopontTorol";
            this.btnIdopontTorol.Size = new System.Drawing.Size(100, 35);
            this.btnIdopontTorol.TabIndex = 1;
            this.btnIdopontTorol.Text = "- Törlés";
            this.btnIdopontTorol.UseVisualStyleBackColor = false;
            this.btnIdopontTorol.Click += new System.EventHandler(this.btnIdopontTorol_Click);
            // 
            // comboBoxIdopontTorlendo
            // 
            this.comboBoxIdopontTorlendo.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.comboBoxIdopontTorlendo.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.comboBoxIdopontTorlendo.FormattingEnabled = true;
            this.comboBoxIdopontTorlendo.Location = new System.Drawing.Point(135, 33);
            this.comboBoxIdopontTorlendo.Name = "comboBoxIdopontTorlendo";
            this.comboBoxIdopontTorlendo.Size = new System.Drawing.Size(140, 28);
            this.comboBoxIdopontTorlendo.TabIndex = 2;
            // 
            // groupBoxMentes
            // 
            this.groupBoxMentes.Controls.Add(this.btnMentes);
            this.groupBoxMentes.Controls.Add(this.btnFrissites);
            this.groupBoxMentes.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.groupBoxMentes.Location = new System.Drawing.Point(840, 10);
            this.groupBoxMentes.Name = "groupBoxMentes";
            this.groupBoxMentes.Size = new System.Drawing.Size(440, 80);
            this.groupBoxMentes.TabIndex = 2;
            this.groupBoxMentes.TabStop = false;
            this.groupBoxMentes.Text = "💾 Műveletek";
            // 
            // btnMentes
            // 
            this.btnMentes.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(123)))), ((int)(((byte)(255)))));
            this.btnMentes.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnMentes.Font = new System.Drawing.Font("Segoe UI", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.btnMentes.ForeColor = System.Drawing.Color.White;
            this.btnMentes.Location = new System.Drawing.Point(15, 25);
            this.btnMentes.Name = "btnMentes";
            this.btnMentes.Size = new System.Drawing.Size(200, 45);
            this.btnMentes.TabIndex = 0;
            this.btnMentes.Text = "💾 MENTÉS";
            this.btnMentes.UseVisualStyleBackColor = false;
            this.btnMentes.Click += new System.EventHandler(this.btnMentes_Click);
            // 
            // btnFrissites
            // 
            this.btnFrissites.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(108)))), ((int)(((byte)(117)))), ((int)(((byte)(125)))));
            this.btnFrissites.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnFrissites.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(238)));
            this.btnFrissites.ForeColor = System.Drawing.Color.White;
            this.btnFrissites.Location = new System.Drawing.Point(230, 25);
            this.btnFrissites.Name = "btnFrissites";
            this.btnFrissites.Size = new System.Drawing.Size(195, 45);
            this.btnFrissites.TabIndex = 1;
            this.btnFrissites.Text = "🔄 Frissítés API-ból";
            this.btnFrissites.UseVisualStyleBackColor = false;
            this.btnFrissites.Click += new System.EventHandler(this.btnFrissites_Click);
            // 
            // panelGrid
            // 
            this.panelGrid.Controls.Add(this.dataGridView1);
            this.panelGrid.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panelGrid.Location = new System.Drawing.Point(0, 160);
            this.panelGrid.Name = "panelGrid";
            this.panelGrid.Padding = new System.Windows.Forms.Padding(20);
            this.panelGrid.Size = new System.Drawing.Size(1300, 490);
            this.panelGrid.TabIndex = 2;
            // 
            // dataGridView1
            // 
            this.dataGridView1.AllowUserToAddRows = false;
            this.dataGridView1.AllowUserToDeleteRows = false;
            this.dataGridView1.BackgroundColor = System.Drawing.Color.White;
            this.dataGridView1.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dataGridView1.Location = new System.Drawing.Point(20, 20);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.ReadOnly = true;
            this.dataGridView1.RowHeadersWidth = 120;
            this.dataGridView1.Size = new System.Drawing.Size(1260, 450);
            this.dataGridView1.TabIndex = 0;
            this.dataGridView1.CellClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.dataGridView1_CellClick);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1300, 650);
            this.Controls.Add(this.panelGrid);
            this.Controls.Add(this.panelGombok);
            this.Controls.Add(this.panelHeader);
            this.MinimumSize = new System.Drawing.Size(1000, 600);
            this.Name = "Form1";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Délibáb Étterem - Admin Felület";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.panelHeader.ResumeLayout(false);
            this.panelHeader.PerformLayout();
            this.panelGombok.ResumeLayout(false);
            this.groupBoxAsztal.ResumeLayout(false);
            this.groupBoxIdopont.ResumeLayout(false);
            this.groupBoxMentes.ResumeLayout(false);
            this.panelGrid.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panelHeader;
        private System.Windows.Forms.Label labelCim;
        private System.Windows.Forms.Label labelStatus;
        private System.Windows.Forms.Panel panelGombok;
        private System.Windows.Forms.GroupBox groupBoxAsztal;
        private System.Windows.Forms.Button btnAsztalHozzaad;
        private System.Windows.Forms.Button btnAsztalTorol;
        private System.Windows.Forms.ComboBox comboBoxAsztalTorlendo;
        private System.Windows.Forms.GroupBox groupBoxIdopont;
        private System.Windows.Forms.Button btnIdopontHozzaad;
        private System.Windows.Forms.Button btnIdopontTorol;
        private System.Windows.Forms.ComboBox comboBoxIdopontTorlendo;
        private System.Windows.Forms.GroupBox groupBoxMentes;
        private System.Windows.Forms.Button btnMentes;
        private System.Windows.Forms.Button btnFrissites;
        private System.Windows.Forms.Panel panelGrid;
        private System.Windows.Forms.DataGridView dataGridView1;
        // IDEIGLENES - TÖRÖLHETŐ!
        private System.Windows.Forms.Button btnTesztExport;
    }
}
