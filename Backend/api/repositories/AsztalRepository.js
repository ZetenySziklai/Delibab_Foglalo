class AsztalRepository{
    constructor(db){
        this.Asztal = db.Asztal;
        this.Foglalas = db.Foglalas;
    }
    
    async getAsztal(){
        return await this.Asztal.findAll();
    }

    async createAsztal(data){
        return await this.Asztal.create(data);
    }

    async getAsztalById(id){
        return await this.Asztal.findByPk(id);
    }

    async updateAsztal(id, data){
        await this.Asztal.update(data, { where: { id: id } });
        return await this.getAsztalById(id);
    }

    async deleteAsztal(id){
        const deleted = await this.Asztal.destroy({ where: { id: id } });
        return deleted > 0;
    }


    // itt valamit basszak
    async getSzabadAsztalok(datum, idopont, helyekSzama){
        const { Op } = require('sequelize');
        
        const foglaltAsztalok = await this.Foglalas.findAll({
            where: { foglalas_datum: new Date(datum + ' ' + idopont) },
            attributes: ['asztal_id'],
            raw: true
        });

        const foglaltAsztalIds = foglaltAsztalok.map(f => f.asztal_id);
        const whereCondition = {
            helyek_szama: { [Op.gte]: helyekSzama || 1 }
        };

        if (foglaltAsztalIds.length > 0) {
            whereCondition.id = { [Op.notIn]: foglaltAsztalIds };
        }

        return await this.Asztal.findAll({
            where: whereCondition
        });
    }
}

module.exports = AsztalRepository;
