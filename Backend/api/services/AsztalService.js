const { BadRequestError } = require("../errors");

class AsztalService {
    constructor(db) {
        this.asztalRepository = require("../repositories")(db).asztalRepository;
    }

    async getAsztal(options = {}) {
        return await this.asztalRepository.getAsztal(options);
    }

    async createAsztal(data, options = {}) {
        if (!data.helyek_szama) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }

        if (isNaN(data.helyek_szama) || data.helyek_szama <= 0) {
            throw new BadRequestError("A helyek száma pozitív szám kell legyen");
        }

        return await this.asztalRepository.createAsztal(data, options);
    }

    async getAsztalById(id, options = {}) {
        return await this.asztalRepository.getAsztalById(id, options);
    }

    async updateAsztal(id, data, options = {}) {
        return await this.asztalRepository.updateAsztal(id, data, options);
    }

    async deleteAsztal(id, options = {}) {
        return await this.asztalRepository.deleteAsztal(id, options);
    }

    async getSzabadAsztalok(datum, idopont, helyekSzama, options = {}) {
        if (!datum || !idopont) {
            throw new BadRequestError("Dátum és időpont kötelező");
        }
        return await this.asztalRepository.getSzabadAsztalok(datum, idopont, helyekSzama, options);
    }
}

module.exports = AsztalService;