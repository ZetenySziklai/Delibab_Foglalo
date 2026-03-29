const { Association } = require("sequelize");

class FoglalasiAdatokRepository {
    constructor(db) {
        this.FoglalasiAdatok = db.FoglalasiAdatok;
        this.Foglalas = db.Foglalas;
    }

    async getFoglalasiAdatok(options = {}) {
        return await this.FoglalasiAdatok.findAll({
            include: [{
                model: this.Foglalas,
                as: "foglalas",
                attributes: ["id"]
            }],
            transaction: options.transaction,
        });
    }

    async createFoglalasiAdatok(data, options = {}) {
        return await this.FoglalasiAdatok.create(data, {
            transaction: options.transaction,
        });
    }

    async getFoglalasiAdatokById(id, options = {}) {
        return await this.FoglalasiAdatok.findByPk(id, {
            include: [{
                model: this.Foglalas,
                as: "foglalas", // VÁLTOZÁS: as alias hozzáadva (korábban hiányzott)
                attributes: ["id"]
            }],
            transaction: options.transaction,
        });
    }

    async updateFoglalasiAdatok(id, data, options = {}) {
        await this.FoglalasiAdatok.update(data, {
            where: { id },
            transaction: options.transaction,
        });
        return await this.getFoglalasiAdatokById(id, options);
    }

    async deleteFoglalasiAdatok(id, options = {}) {
        const deleted = await this.FoglalasiAdatok.destroy({
            where: { id },
            transaction: options.transaction,
        });
        return deleted > 0;
    }
}

module.exports = FoglalasiAdatokRepository;