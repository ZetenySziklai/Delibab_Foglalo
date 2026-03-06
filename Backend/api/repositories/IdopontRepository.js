class IdopontRepository {
    constructor(db) {
        this.Idopont = db.Idopont;
    }

    async getIdopont(options = {}) {
        return await this.Idopont.findAll({
            transaction: options.transaction,
        });
    }

    async createIdopont(data, options = {}) {
        return await this.Idopont.create(data, {
            transaction: options.transaction,
        });
    }

    async getIdopontById(id, options = {}) {
        return await this.Idopont.findByPk(id, {
            transaction: options.transaction,
        });
    }

    async updateIdopont(id, data, options = {}) {
        await this.Idopont.update(data, {
            where: { id },
            transaction: options.transaction,
        });
        return await this.getIdopontById(id, options);
    }

    async deleteIdopont(id, options = {}) {
        const deleted = await this.Idopont.destroy({
            where: { id },
            transaction: options.transaction,
        });
        return deleted > 0;
    }
}

module.exports = IdopontRepository;