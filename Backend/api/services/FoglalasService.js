const { BadRequestError, NotFoundError } = require("../errors");

class FoglalasService {
    constructor(db) {
        this.foglalasRepository = require("../repositories")(db).foglalasRepository;
        this.userRepository = require("../repositories")(db).userRepository;
        this.asztalRepository = require("../repositories")(db).asztalRepository;
    }

    async getFoglalas() {
        return await this.foglalasRepository.getFoglalas();
    }

    async createFoglalas(data) {
        const t = await this.foglalasRepository.Foglalas.sequelize.transaction();

        try {
            if (!data.user_id || !data.asztal_id || !data.foglalas_datum) {
                throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
            }

            const user = await this.userRepository.getUserById(data.user_id, { transaction: t });
            if (!user) throw new NotFoundError("A megadott felhasználó nem létezik");

            const asztal = await this.asztalRepository.getAsztalById(data.asztal_id, { transaction: t });
            if (!asztal) throw new NotFoundError("A megadott asztal nem létezik");

            const foglalasDatum = new Date(data.foglalas_datum);
            if (isNaN(foglalasDatum.getTime()) || foglalasDatum < new Date()) {
                throw new BadRequestError("Érvénytelen vagy múltbeli dátum");
            }

            const datumResz = data.foglalas_datum.split(' ')[0];
            const foglaltIdopontok = await this.foglalasRepository.getFoglaltIdopontok(datumResz, data.asztal_id, { transaction: t, lock: t.LOCK.UPDATE });

            const vanDuplikatum = foglaltIdopontok.some(foglalas => {
                const kulonbseg = Math.abs(new Date(foglalas.foglalas_datum).getTime() - foglalasDatum.getTime());
                return kulonbseg < 3600000;
            });

            if (vanDuplikatum) throw new BadRequestError("Az asztal már foglalt ezen az időponton");

            const foglalas = await this.foglalasRepository.createFoglalas(data, { transaction: t });

            await t.commit();
            return foglalas;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getFoglalasById(id) {
        return await this.foglalasRepository.getFoglalasById(id);
    }

    async updateFoglalas(id, data) {
        return await this.foglalasRepository.updateFoglalas(id, data);
    }

    async deleteFoglalas(id) {
        return await this.foglalasRepository.deleteFoglalas(id);
    }

    async getFoglaltIdopontok(datum, asztalId) {
        if (!datum || !asztalId) {
            throw new BadRequestError("Dátum és asztal ID kötelező");
        }
        return await this.foglalasRepository.getFoglaltIdopontok(datum, asztalId);
    }

    async getFoglalasByDatum(datum) {
        if (!datum) {
            throw new BadRequestError("Dátum kötelező");
        }
        return await this.foglalasRepository.getFoglalasByDatum(datum);
    }

    async getFoglalasByUser(userId) {
        if (!userId) {
            throw new BadRequestError("Felhasználó ID kötelező");
        }
        return await this.foglalasRepository.getFoglalasByUser(userId);
    }
}

module.exports = FoglalasService;