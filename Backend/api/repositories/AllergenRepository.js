class AllergenRepository{
    constructor(db){
        this.Allergen = db.Allergen;
        this.sequelize = db.sequelize;
    }
    
    async getAllergen(){
        return await this.Allergen.findAll({
            order: [['nev', 'ASC']]
        });
    }

    async getAllergenById(id){
        return await this.Allergen.findByPk(id);
    }

    async createAllergen(data){
        return await this.Allergen.create(data);
    }

    async updateAllergen(id, data){
        await this.Allergen.update(data, { where: { id: id } });
        return await this.Allergen.findByPk(id);
    }

    async deleteAllergen(id){
        const deleted = await this.Allergen.destroy({ where: { id: id } });
        return deleted > 0;
    }
}

module.exports = AllergenRepository;


