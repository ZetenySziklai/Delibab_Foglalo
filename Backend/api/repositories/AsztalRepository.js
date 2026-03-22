const { Op, col } = require('sequelize');

const { DbError } = require("../errors");

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

    async getSzabadAsztalok(datum, idopont, options = {}) {
        

        const foglalasIdo = new Date(datum + ' ' + idopont);
        foglalasIdo.setHours(foglalasIdo.getHours() + 1);

        try
        {
            return await this.Asztal.findAll(
            {
                include:
                {
                    association: "foglalasok",

                    include:
                    {
                        association: "foglalasiAdatok",

                        where: 
                        {
                            foglalas_datum:
                            {
                                [Op.eq]: foglalasIdo.toISOString(),
                            }
                        }
                    },
                },

                where:
                {
                    [Op.or]:
                    [
                        
                        {
                            "$foglalasok.foglalasiAdatok.foglalas_datum$":
                            {
                                [Op.ne]: foglalasIdo.toISOString(),
                            }    
                        },

                        {
                            "$foglalasok.foglalasiAdatok.foglalas_datum$": null,
                        }

                    ]

                },
            });
        }
        catch(error)
        {
            throw new DbError("Failed fetching reservations");
        }
    }
}

module.exports = AsztalRepository;