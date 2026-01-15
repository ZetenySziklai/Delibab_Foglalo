const { BadRequestError } = require("../errors");

class FoglaloService {
    constructor(db){
        const repos = require("../repositories")(db);
        this.foglaloRepository = repos.foglaloRepository;
        this.userRepository = repos.userRepository;
        this.foglalasRepository = repos.foglalasRepository;
        this.asztalRepository = repos.asztalRepository;
        this.etkezesTipusaRepository = repos.etkezesTipusaRepository;
        this.megjegyzesRepository = repos.megjegyzesRepository;
    }
    
    async getFoglalo(){
        return await this.foglaloRepository.getFoglalo();
    }

    async getFoglaloByEmail(email){
        if (!email || !email.includes('@')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }
        return await this.foglaloRepository.getFoglaloByEmail(email);
    }

    async getFoglaloWithDetails(){
        return await this.foglaloRepository.getFoglaloWithDetails();
    }

    async createFoglalo(data){
        // Validálás
        if (!data.vezeteknev || !data.keresztnev || !data.email || !data.telefonszam) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }
        
        if (!data.email.includes('@')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }

        // Telefonszám: csak számok (+ előjel és szóköz/-, 7-15 számjegy)
        const phoneNormalized = String(data.telefonszam).replace(/[\s-]/g, "");
        if (!/^\+?\d{7,15}$/.test(phoneNormalized)) {
            throw new BadRequestError("A telefonszám csak szám lehet (7-15 számjegy)");
        }

        // Normalizált telefonszámot mentjük az adatbázisba
        data.telefonszam = phoneNormalized;

        // 1. Foglalo mentése (eredeti logika megtartása)
        const foglalo = await this.foglaloRepository.createFoglalo(data);

        try {
            // 2. User létrehozása/keresése
            let userId = null;
            try {
                 // Most már biztosan van getUserByEmail metódus
                 const userResult = await this.userRepository.getUserByEmail(data.email);
                 
                 if (userResult) {
                     // Ha megtaláltuk (findOne objektumot ad vissza)
                     userId = userResult.id;
                 } else {
                    // Ha nincs, létrehozzuk
                    const newUser = await this.userRepository.createUser({
                        vezeteknev: data.vezeteknev,
                        keresztnev: data.keresztnev,
                        email: data.email,
                        telefonszam: data.telefonszam
                     });
                     userId = newUser.id;
                 }
            } catch (err) {
                console.error("Kritikus hiba a User kezelésekor:", err);
                throw err; // Továbbdobjuk, mert User nélkül nem lehet foglalni
            }

            // 3. Megjegyzés mentése
            let megjegyzesId = null;
            if (data.megjegyzes) {
                const megjegyzes = await this.megjegyzesRepository.createMegjegyzes({ szoveg: data.megjegyzes });
                megjegyzesId = megjegyzes.id;
            }

            // 4. Étkezés típusa
            let etkezesId = 2; // Alapértelmezett Ebéd
            if (data.etkezesTipus) {
                if (data.etkezesTipus === 'Reggeli') etkezesId = 1;
                else if (data.etkezesTipus === 'Ebéd') etkezesId = 2;
                else if (data.etkezesTipus === 'Vacsora') etkezesId = 3;
            } else if (data.date) {
                // Fallback, ha a frontend nem küldte
                const hour = new Date(data.date).getHours();
                if (hour < 11) etkezesId = 1;
                else if (hour >= 17) etkezesId = 3;
            }

            // 5. Foglalás mentése a 'foglalas' táblába
            // Megkeresünk egy létező asztalt, hogy elkerüljük a foreign key hibát
            let asztalok = await this.asztalRepository.getAsztal();
            
            // Ha nincsenek asztalok, hozzunk létre néhányat (automatikus seed)
            if (!asztalok || asztalok.length === 0) {
                console.log("Nincsenek asztalok, alapértelmezett asztalok létrehozása...");
                try {
                    await this.asztalRepository.createAsztal({ helyek_szama: 2, asztal_allapot_id: 1 });
                    await this.asztalRepository.createAsztal({ helyek_szama: 4, asztal_allapot_id: 1 });
                    await this.asztalRepository.createAsztal({ helyek_szama: 4, asztal_allapot_id: 1 });
                    await this.asztalRepository.createAsztal({ helyek_szama: 6, asztal_allapot_id: 1 });
                    await this.asztalRepository.createAsztal({ helyek_szama: 8, asztal_allapot_id: 1 });
                    
                    // Újra lekérjük a létrehozás után
                    asztalok = await this.asztalRepository.getAsztal();
                } catch (seedErr) {
                    console.error("Hiba az asztalok létrehozásakor:", seedErr);
                    throw new Error("Nem sikerült asztalokat létrehozni, így a foglalás nem lehetséges.");
                }
            }
            
            if (!asztalok || asztalok.length === 0) {
                 throw new Error("Nincsenek asztalok rögzítve a rendszerben, nem lehet foglalni.");
            }
            
            // Válasszunk egy asztalt, ami megfelel a létszámnak (ha van people adat)
            // Ha nincs people, vagy nincs megfelelő, akkor az elsőt választjuk
            let asztalId = asztalok[0].id;
            if (data.people) {
                const peopleCount = parseInt(data.people);
                const suitableTable = asztalok.find(a => a.helyek_szama >= peopleCount);
                if (suitableTable) {
                    asztalId = suitableTable.id;
                }
            }

            if (data.date) {
                await this.foglalasRepository.createFoglalas({
                    user_id: userId,
                    asztal_id: asztalId,
                    foglalas_datum: data.date,
                    etkezes_id: etkezesId,
                    megjegyzes_id: megjegyzesId
                });
            }
        } catch (error) {
            console.error("Hiba a foglalás szinkronizálásakor:", error);
            // Most már továbbdobjuk a hibát, hogy látszódjon, ha baj van
            throw new Error(`Foglalás mentése sikertelen: ${error.message}`);
        }

        return foglalo;
    }

    async updateFoglalo(id, data){
        if (data.email) {
            const existing = await this.foglaloRepository.getFoglaloByEmail(data.email);
            if (existing && existing.length > 0 && existing[0].foglalo_id !== parseInt(id)) {
                throw new BadRequestError("Ez az email cím már használatban van");
            }
        }
        
        return await this.foglaloRepository.updateFoglalo(id, data);
    }

    async deleteFoglalo(id){
        return await this.foglaloRepository.deleteFoglalo(id);
    }

    async getFoglaloCountByEmail(){
        return await this.foglaloRepository.getFoglaloCountByEmail();
    }

    async getTopFoglalok(limit){
        return await this.foglaloRepository.getTopFoglalok(limit);
    }

    async getFoglalokByDateRange(startDate, endDate){
        if (!startDate || !endDate) {
            throw new BadRequestError("Kezdő és végdátum megadása kötelező");
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestError("Érvényes dátumokat adjon meg");
        }
        
        if (start > end) {
            throw new BadRequestError("A kezdő dátum nem lehet későbbi, mint a végdátum");
        }
        
        return await this.foglaloRepository.getFoglalokByDateRange(startDate, endDate);
    }

    async getFoglalokByEtkezesType(){
        return await this.foglaloRepository.getFoglalokByEtkezesType();
    }
}

module.exports = FoglaloService;