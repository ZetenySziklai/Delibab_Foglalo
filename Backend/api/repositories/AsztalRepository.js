class AsztalRepository{
    constructor(db){
        this.Asztal = db.Asztal;
        this.AsztalAllapot = db.AsztalAllapot;
        this.Foglalas = db.Foglalas;
        this.sequelize = db.sequelize;
    }
    
    async getAsztal(){
        return await this.Asztal.findAll({
            include: [{
                model: this.AsztalAllapot,
                attributes: ["nev"]
            }]
        });
    }

    async createAsztal(data){
        return await this.Asztal.create(data);
    }

    async getAsztalById(id){
        return await this.Asztal.findByPk(id, {
            include: [{
                model: this.AsztalAllapot,
                attributes: ["nev"]
            }]
        });
    }

    async updateAsztal(id, data){
        await this.Asztal.update(data, { where: { id: id } });
        return await this.getAsztalById(id);
    }

    async deleteAsztal(id){
        const deleted = await this.Asztal.destroy({ where: { id: id } });
        return deleted > 0;
    }

    async getSzabadAsztalok(datum, idopont, helyekSzama){
        const { Op } = require('sequelize');
        
        const foglaltAsztalok = await this.Foglalas.findAll({
            where: { foglalas_datum: new Date(datum + ' ' + idopont) },
            attributes: ['asztal_id'],
            raw: true
        });

        const foglaltAsztalIds = foglaltAsztalok.map(f => f.asztal_id);
        const whereCondition = {
            asztal_allapot_id: 1,
            helyek_szama: { [Op.gte]: helyekSzama || 1 }
        };

        if (foglaltAsztalIds.length > 0) {
            whereCondition.id = { [Op.notIn]: foglaltAsztalIds };
        }

        return await this.Asztal.findAll({
            where: whereCondition,
            include: [{ model: this.AsztalAllapot, attributes: ["nev"] }]
        });
    }
}

module.exports = AsztalRepository;
