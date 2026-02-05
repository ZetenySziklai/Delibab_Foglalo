const { BadRequestError, NotFoundError } = require("../errors");

class FoglalasService {
    constructor(db){
        this.foglalasRepository = require("../repositories")(db).foglalasRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.asztalRepository = require("../repositories")(db).asztalRepository;
        this.etkezesTipusaRepository = require("../repositories")(db).etkezesTipusaRepository;
    }
    
    async getFoglalas(){
        return await this.foglalasRepository.getFoglalas();
    }

    async createFoglalas(data){
        // Kötelező mezők ellenőrzése
        if (!data.user_id || !data.asztal_id || !data.foglalas_datum || !data.etkezes_id) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }

        // Felhasználó létezik-e
        const user = await this.userRepository.getUserById(data.user_id);
        if (!user) {
            throw new NotFoundError("A megadott felhasználó nem létezik");
        }

        // Asztal létezik-e
        const asztal = await this.asztalRepository.getAsztalById(data.asztal_id);
        if (!asztal) {
            throw new NotFoundError("A megadott asztal nem létezik");
        }

        // Étkezés típus létezik-e
        const etkezes = await this.etkezesTipusaRepository.getEtkezesTipusaById(data.etkezes_id);
        if (!etkezes) {
            throw new NotFoundError("A megadott étkezés típus nem létezik");
        }

        // Dátum validáció - nem lehet múltban
        const foglalasDatum = new Date(data.foglalas_datum);
        if (isNaN(foglalasDatum.getTime())) {
            throw new BadRequestError("Érvénytelen dátum formátum");
        }

        const most = new Date();
        if (foglalasDatum < most) {
            throw new BadRequestError("A foglalás dátuma nem lehet a múltban");
        }

        // Duplikált foglalás ellenőrzése - ugyanaz az asztal, ugyanaz az időpont
        const datumResz = data.foglalas_datum.split(' ')[0];
        const foglaltIdopontok = await this.foglalasRepository.getFoglaltIdopontok(
            datumResz, 
            data.asztal_id
        );
        const foglaltDatum = new Date(data.foglalas_datum);
        const vanDuplikatum = foglaltIdopontok.some(foglalas => {
            const idopontDatum = new Date(foglalas.foglalas_datum);
            // 1 órán belüli különbség = duplikátum
            const kulonbseg = Math.abs(idopontDatum.getTime() - foglaltDatum.getTime());
            return kulonbseg < 3600000; // 1 óra = 3600000 ms
        });
        
        if (vanDuplikatum) {
            throw new BadRequestError("Az asztal már foglalt ezen az időponton");
        }

        // Foglalás létrehozása
        const foglalas = await this.foglalasRepository.createFoglalas(data);

        // Asztal állapotának frissítése "foglalt"-ra (1)
        await this.asztalRepository.updateAsztal(data.asztal_id, {
            asztal_allapot_id: 1
        });

        return foglalas;
    }

    async getFoglalasById(id){
        return await this.foglalasRepository.getFoglalasById(id);
    }

    async updateFoglalas(id, data){
        return await this.foglalasRepository.updateFoglalas(id, data);
    }

    async deleteFoglalas(id){
        return await this.foglalasRepository.deleteFoglalas(id);
    }

    async getFoglaltIdopontok(datum, asztalId){
        if (!datum || !asztalId) {
            throw new BadRequestError("Dátum és asztal ID kötelező");
        }
        return await this.foglalasRepository.getFoglaltIdopontok(datum, asztalId);
    }

    async getFoglalasByDatum(datum){
        if (!datum) {
            throw new BadRequestError("Dátum kötelező");
        }
        return await this.foglalasRepository.getFoglalasByDatum(datum);
    }

    async getFoglalasByUser(userId){
        if (!userId) {
            throw new BadRequestError("Felhasználó ID kötelező");
        }
        return await this.foglalasRepository.getFoglalasByUser(userId);
    }
}

module.exports = FoglalasService;