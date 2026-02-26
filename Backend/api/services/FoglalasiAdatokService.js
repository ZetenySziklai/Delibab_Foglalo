const { BadRequestError, NotFoundError } = require("../errors");

class FoglalasiAdatokService {
    constructor(db){
        this.foglalasiAdatokRepository = require("../repositories")(db).foglalasiAdatokRepository;
        this.foglalasRepository = require("../repositories")(db).foglalasRepository;
    }
    
    async getFoglalasiAdatok(){
        return await this.foglalasiAdatokRepository.getFoglalasiAdatok();
    }

    async createFoglalasiAdatok(data) {
        const t = await this.foglalasiAdatokRepository.FoglalasiAdatok.sequelize.transaction();

        try {
            if (!data.foglalas_datum || data.felnott === undefined || data.gyerek === undefined) {
                throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
            }
            if (data.felnott < 0 || data.gyerek < 0) {
                throw new BadRequestError("A felnőtt és gyerek szám nem lehet negatív");
            }

            if (data.foglalas_id) {
                const foglalas = await this.foglalasRepository.getFoglalasById(data.foglalas_id, { transaction: t, lock: t.LOCK.UPDATE });
                if (!foglalas) throw new NotFoundError("A megadott foglalás nem létezik");
            }

            const result = await this.foglalasiAdatokRepository.createFoglalasiAdatok(data, { transaction: t });

            await t.commit();
            return result;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async getFoglalasiAdatokById(id){
        return await this.foglalasiAdatokRepository.getFoglalasiAdatokById(id);
    }

    async updateFoglalasiAdatok(id, data){
        if (data.felnott !== undefined && data.felnott < 0) {
            throw new BadRequestError("A felnőtt szám nem lehet negatív");
        }
        if (data.gyerek !== undefined && data.gyerek < 0) {
            throw new BadRequestError("A gyerek szám nem lehet negatív");
        }
        return await this.foglalasiAdatokRepository.updateFoglalasiAdatok(id, data);
    }

    async deleteFoglalasiAdatok(id){
        return await this.foglalasiAdatokRepository.deleteFoglalasiAdatok(id);
    }
}

module.exports = FoglalasiAdatokService;

