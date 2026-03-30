class FoglalasRepository {
    constructor(db) {
        this.Foglalas = db.Foglalas;
        this.Felhasznalo = db.Felhasznalo;
        this.Asztal = db.Asztal;
    }

    async getFoglalas(options = {}) {
        return await this.Foglalas.findAll({
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    as: "asztal", 
                    attributes: ["helyek_szama"]
                }
            ],
            transaction: options.transaction,
        });
    }

    async createFoglalas(data, options = {}) {
        return await this.Foglalas.create(data, {
            transaction: options.transaction,
        });
    }

    async getFoglalasById(id, options = {}) {
        return await this.Foglalas.findByPk(id, {
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    as: "asztal", 
                    attributes: ["helyek_szama"]
                }
            ],
            transaction: options.transaction,
        });
    }

    async updateFoglalas(id, data, options = {}) {
        await this.Foglalas.update(data, {
            where: { id },
            transaction: options.transaction,
        });
        return await this.getFoglalasById(id, options);
    }

    async deleteFoglalas(id, options = {}) {
        const deleted = await this.Foglalas.destroy({
            where: { id },
            transaction: options.transaction,
        });
        return deleted > 0;
    }

    async getFoglaltIdopontok(datum, asztalId, options = {}) {
        const { Op } = require('sequelize');

        return await this.Foglalas.findAll({
            where: {
                asztal_id: asztalId,
                foglalas_datum: {
                    [Op.gte]: new Date(datum + ' 00:00:00'),
                    [Op.lt]: new Date(new Date(datum).setDate(new Date(datum).getDate() + 1))
                }
            },
            attributes: ['id', 'foglalas_datum', 'user_id', 'asztal_id'],
            transaction: options.transaction,
            lock: options.lock,
        });
    }

    async getFoglalasByDatum(datum, options = {}) {
        const { Op } = require('sequelize');

        return await this.Foglalas.findAll({
            where: {
                foglalas_datum: {
                    [Op.gte]: new Date(datum + ' 00:00:00'),
                    [Op.lt]: new Date(new Date(datum).setDate(new Date(datum).getDate() + 1))
                }
            },
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    as: "asztal", 
                    attributes: ["helyek_szama"]
                }
            ],
            transaction: options.transaction,
        });
    }

    async getFoglalasByUser(userId, options = {}) {
        return await this.Foglalas.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    as: "asztal",
                    attributes: ["helyek_szama"]
                }
            ],
            transaction: options.transaction,
        });
    }
}

module.exports = FoglalasRepository;