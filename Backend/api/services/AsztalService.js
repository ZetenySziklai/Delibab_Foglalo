class AsztalService {
    constructor(db){
        this.asztalRepository = require("../repositories")(db).asztalRepository;
        this.asztalAllapotRepository = require("../repositories")(db).asztalAllapotRepository;
    }
    
    async getAsztal(){
        return await this.asztalRepository.getAsztal();
    }

    async createAsztal(data){
        if (!data.helyek_szama || !data.asztal_allapot_id) {
            throw new Error("Minden kötelező mezőt ki kell tölteni");
        }

        // Helyek száma pozitív szám kell legyen
        if (isNaN(data.helyek_szama) || data.helyek_szama <= 0) {
            throw new Error("A helyek száma pozitív szám kell legyen");
        }

        // Asztal állapot létezik-e
        const allapot = await this.asztalAllapotRepository.getAsztalAllapotById(data.asztal_allapot_id);
        if (!allapot) {
            throw new Error("Az asztal állapot nem létezik");
        }

        return await this.asztalRepository.createAsztal(data);
    }

    async getAsztalById(id){
        return await this.asztalRepository.getAsztalById(id);
    }

    async updateAsztal(id, data){
        return await this.asztalRepository.updateAsztal(id, data);
    }

    async deleteAsztal(id){
        return await this.asztalRepository.deleteAsztal(id);
    }

    async getSzabadAsztalok(datum, idopont, helyekSzama){
        if (!datum || !idopont) {
            throw new Error("Dátum és időpont kötelező");
        }
        return await this.asztalRepository.getSzabadAsztalok(datum, idopont, helyekSzama);
    }
}

module.exports = AsztalService;
