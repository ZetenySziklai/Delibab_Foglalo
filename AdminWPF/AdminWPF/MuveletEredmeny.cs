namespace AdminWPF
{
    /// <summary>
    /// Egy művelet eredményét tárolja (siker/hiba, üzenet)
    /// </summary>
    public class MuveletEredmeny
    {
        public bool Sikeres { get; set; }
        public string Uzenet { get; set; }
        public object Eredmeny { get; set; }

        public MuveletEredmeny(bool sikeres, string uzenet, object eredmeny = null)
        {
            Sikeres = sikeres;
            Uzenet = uzenet;
            Eredmeny = eredmeny;
        }

        public static MuveletEredmeny Siker(string uzenet, object eredmeny = null)
        {
            return new MuveletEredmeny(true, uzenet, eredmeny);
        }

        public static MuveletEredmeny Hiba(string uzenet)
        {
            return new MuveletEredmeny(false, uzenet);
        }
    }
}

