const { BadRequestError, NotFoundError } = require("../errors");

class FoglalasiAdatokService {
    constructor(db) {
        this.foglalasiAdatokRepository = require("../repositories")(db).foglalasiAdatokRepository;
        this.foglalasRepository = require("../repositories")(db).foglalasRepository;
    }

    async getFoglalasiAdatok(options = {}) {
        return await this.foglalasiAdatokRepository.getFoglalasiAdatok(options);
    }

    async createFoglalasiAdatok(data, options = {}) {
        if (!data.foglalas_datum || data.felnott === undefined || data.gyerek === undefined) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }

        if (data.felnott < 0 || data.gyerek < 0) {
            throw new BadRequestError("A felnőtt és gyerek szám nem lehet negatív");
        }

        if (data.foglalas_id) {
            const foglalas = await this.foglalasRepository.getFoglalasById(data.foglalas_id, options);
            if (!foglalas) throw new NotFoundError("A megadott foglalás nem létezik");
        }

        return await this.foglalasiAdatokRepository.createFoglalasiAdatok(data, options);
    }

    async getFoglalasiAdatokById(id, options = {}) {
        return await this.foglalasiAdatokRepository.getFoglalasiAdatokById(id, options);
    }

    async updateFoglalasiAdatok(id, data, options = {}) {
        if (data.felnott !== undefined && data.felnott < 0) {
            throw new BadRequestError("A felnőtt szám nem lehet negatív");
        }
        if (data.gyerek !== undefined && data.gyerek < 0) {
            throw new BadRequestError("A gyerek szám nem lehet negatív");
        }
        return await this.foglalasiAdatokRepository.updateFoglalasiAdatok(id, data, options);
    }

    async deleteFoglalasiAdatok(id, options = {}) {
        return await this.foglalasiAdatokRepository.deleteFoglalasiAdatok(id, options);
    }
}

module.exports = FoglalasiAdatokService;