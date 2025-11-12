class MegjegyzesRepository{
    constructor(db){
        this.Megjegyzes = db.Megjegyzes;
        this.sequelize = db.sequelize;
    }
    
    async getMegjegyzes(){
        return await this.Megjegyzes.findAll({
            order: [['id', 'DESC']]
        });
    }

    async getMegjegyzesById(id){
        return await this.Megjegyzes.findByPk(id);
    }

    async createMegjegyzes(data){
        return await this.Megjegyzes.create(data);
    }

    async updateMegjegyzes(id, data){
        await this.Megjegyzes.update(data, { where: { id: id } });
        return await this.Megjegyzes.findByPk(id);
    }

    async deleteMegjegyzes(id){
        const deleted = await this.Megjegyzes.destroy({ where: { id: id } });
        return deleted > 0;
    }
}

module.exports = MegjegyzesRepository;


