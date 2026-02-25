const { BadRequestError, NotFoundError } = require("../errors");

class AsztalService {
    constructor(db){
        this.asztalRepository = require("../repositories")(db).asztalRepository;
    }
    
    async getAsztal(){
        return await this.asztalRepository.getAsztal();
    }

    async createAsztal(data){
        if (!data.helyek_szama) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }

        if (isNaN(data.helyek_szama) || data.helyek_szama <= 0) {
            throw new BadRequestError("A helyek száma pozitív szám kell legyen");
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
            throw new BadRequestError("Dátum és időpont kötelező");
        }
        return await this.asztalRepository.getSzabadAsztalok(datum, idopont, helyekSzama);
    }
}

module.exports = AsztalService;
