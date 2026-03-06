const { BadRequestError } = require("../errors");

class IdopontService {
    constructor(db) {
        this.idopontRepository = require("../repositories")(db).idopontRepository;
    }

    async getIdopont(options = {}) {
        return await this.idopontRepository.getIdopont(options);
    }

    async createIdopont(data, options = {}) {
        if (data.kezdet === undefined || data.veg === undefined) {
            throw new BadRequestError("A kezdet és vég időpont kötelező mező");
        }

        if (data.kezdet < 0 || data.veg < 0 || data.kezdet >= data.veg) {
            throw new BadRequestError("Érvénytelen időpont értékek");
        }

        return await this.idopontRepository.createIdopont(data, options);
    }

    async getIdopontById(id, options = {}) {
        return await this.idopontRepository.getIdopontById(id, options);
    }

    async updateIdopont(id, data, options = {}) {
        if (data.kezdet !== undefined && data.veg !== undefined && data.kezdet >= data.veg) {
            throw new BadRequestError("A kezdet időpontnak korábbinak kell lennie, mint a vég időpontnak");
        }
        return await this.idopontRepository.updateIdopont(id, data, options);
    }

    async deleteIdopont(id, options = {}) {
        return await this.idopontRepository.deleteIdopont(id, options);
    }
}

module.exports = IdopontService;