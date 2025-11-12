class AllergeninfoRepository{
    constructor(db){
        this.Allergeninfo = db.Allergeninfo;
        this.Allergen = db.Allergen;
        this.Foglalas = db.Foglalas;
        this.sequelize = db.sequelize;
    }
    
    async getAllergeninfo(){
        return await this.Allergeninfo.findAll({
            include: [
                {
                    model: this.Allergen,
                    attributes: ["nev"]
                },
                {
                    model: this.Foglalas,
                    attributes: ["id", "foglalas_datum"]
                }
            ]
        });
    }

    async getAllergeninfoById(id){
        return await this.Allergeninfo.findByPk(id, {
            include: [
                {
                    model: this.Allergen,
                    attributes: ["nev"]
                },
                {
                    model: this.Foglalas,
                    attributes: ["id", "foglalas_datum"]
                }
            ]
        });
    }

    async createAllergeninfo(data){
        return await this.Allergeninfo.create(data);
    }

    async updateAllergeninfo(id, data){
        await this.Allergeninfo.update(data, { where: { id: id } });
        return await this.getAllergeninfoById(id);
    }

    async deleteAllergeninfo(id){
        const deleted = await this.Allergeninfo.destroy({ where: { id: id } });
        return deleted > 0;
    }

    async getAllergeninfoByFoglalas(foglalasId){
        return await this.Allergeninfo.findAll({
            where: { foglalas_id: foglalasId },
            include: [
                {
                    model: this.Allergen,
                    attributes: ["id", "nev"]
                }
            ]
        });
    }

    async deleteAllergeninfoByFoglalas(foglalasId){
        const deleted = await this.Allergeninfo.destroy({ where: { foglalas_id: foglalasId } });
        return deleted > 0;
    }
}

module.exports = AllergeninfoRepository;


