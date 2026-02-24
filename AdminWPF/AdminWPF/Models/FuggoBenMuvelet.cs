namespace AdminWPF.Models
{
    public enum MuveletTipus
    {
        AsztalLetrehoz,
        AsztalTorol,
        IdopontLetrehoz,
        IdopontTorol,
        FoglalasLetrehoz,
        FoglalasTorol
    }

    public class FuggoBenMuvelet
    {
        public MuveletTipus Tipus { get; set; }

        // Asztal műveletek
        public AsztalLetrehozas? UjAsztal { get; set; }
        public int? AsztalId { get; set; }

        // Időpont műveletek
        public IdopontLetrehozas? UjIdopont { get; set; }
        public int? IdopontId { get; set; }

        // Foglalás műveletek
        public FoglalasLetrehozas? UjFoglalas { get; set; }
        public int? FoglalasId { get; set; }
        public int? FoglalaId { get; set; }   // foglalasiadatok FK

        public string Leiras => Tipus switch
        {
            MuveletTipus.AsztalLetrehoz   => $"+ Asztal ({UjAsztal?.HelyekSzama} fő)",
            MuveletTipus.AsztalTorol      => $"- Asztal #{AsztalId}",
            MuveletTipus.IdopontLetrehoz  => $"+ Időpont",
            MuveletTipus.IdopontTorol     => $"- Időpont #{IdopontId}",
            MuveletTipus.FoglalasLetrehoz => $"+ Foglalás A#{UjFoglalas?.AsztalId} I#{UjFoglalas?.IdopontId}",
            MuveletTipus.FoglalasTorol    => $"- Foglalás #{FoglalasId}",
            _                             => "?"
        };
    }
}
