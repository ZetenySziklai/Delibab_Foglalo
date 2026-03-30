const { BadRequestError, NotFoundError } = require("../errors");

class FoglalasService {
    constructor(db) {
        this.foglalasRepository = require("../repositories")(db).foglalasRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.asztalRepository = require("../repositories")(db).asztalRepository;
    }

    async getFoglalas(options = {}) {
        return await this.foglalasRepository.getFoglalas(options);
    }


    async createFoglalas(data, options = {}) {
        if (!data.user_id || !data.asztal_id || !data.foglalas_datum) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }

        const user = await this.userRepository.getUserById(data.user_id, options);
        if (!user) throw new NotFoundError("A megadott felhasználó nem létezik");

        const asztal = await this.asztalRepository.getAsztalById(data.asztal_id, options);
        if (!asztal) throw new NotFoundError("A megadott asztal nem létezik");

        return await this.foglalasRepository.createFoglalas(data, options);
    }

    async getFoglalasById(id, options = {}) {
        return await this.foglalasRepository.getFoglalasById(id, options);
    }

    async updateFoglalas(id, data, options = {}) {
        return await this.foglalasRepository.updateFoglalas(id, data, options);
    }

    async deleteFoglalas(id, options = {}) {
        return await this.foglalasRepository.deleteFoglalas(id, options);
    }

    async getFoglaltIdopontok(datum, asztalId, options = {}) {
        if (!datum || !asztalId) {
            throw new BadRequestError("Dátum és asztal ID kötelező");
        }
        return await this.foglalasRepository.getFoglaltIdopontok(datum, asztalId, options);
    }

    async getFoglalasByDatum(datum, options = {}) {
        if (!datum) {
            throw new BadRequestError("Dátum kötelező");
        }
        return await this.foglalasRepository.getFoglalasByDatum(datum, options);
    }

    async getFoglalasByUser(userId, options = {}) {
        if (!userId) {
            throw new BadRequestError("Felhasználó ID kötelező");
        }
        return await this.foglalasRepository.getFoglalasByUser(userId, options);
    }
}

module.exports = FoglalasService;