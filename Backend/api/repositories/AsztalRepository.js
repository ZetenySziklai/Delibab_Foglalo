const { Op, col } = require('sequelize');

class AsztalRepository {
    constructor(db) {
        this.Asztal = db.Asztal;
        this.Foglalas = db.Foglalas;
    }

    async getAsztal(options = {}) {
        return await this.Asztal.findAll({
            transaction: options.transaction,
        });
    }

    async createAsztal(data, options = {}) {
        return await this.Asztal.create(data, {
            transaction: options.transaction,
        });
    }

    async getAsztalById(id, options = {}) {
        return await this.Asztal.findByPk(id, {
            transaction: options.transaction,
        });
    }

    async updateAsztal(id, data, options = {}) {
        await this.Asztal.update(data, {
            where: { id },
            transaction: options.transaction,
        });
        return await this.getAsztalById(id, options);
    }

    async deleteAsztal(id, options = {}) {
        const deleted = await this.Asztal.destroy({
            where: { id },
            transaction: options.transaction,
        });
        return deleted > 0;
    }

    async getSzabadAsztalok(datum, idopont, helyekSzama, options = {}) {
        

        const foglalasDatum = new Date(datum + ' ' + idopont);
        foglalasDatum.setHours(foglalasDatum.getHours() + 1);

        const foglaltAsztalok = await this.Foglalas.findAll({
            attributes: ['asztal_id'],
            include:
            {
                association: "foglalasiAdatok",
                required: true,
            },
            where:
            {
                "$foglalasiAdatok.foglalas_datum$": foglalasDatum,
            },
            raw: true,
            transaction: options.transaction,
        });

        const foglaltAsztalIds = foglaltAsztalok.map(f => f.asztal_id);
        const whereCondition = {
            helyek_szama: { [Op.gte]: helyekSzama || 1 }
        };

        if (foglaltAsztalIds.length > 0) {
            whereCondition.id = { [Op.notIn]: foglaltAsztalIds };
        }

        return await this.Asztal.findAll({
            where: whereCondition,
            transaction: options.transaction,
        });
    }
}

module.exports = AsztalRepository;