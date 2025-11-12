class AsztalAllapotRepository{
    constructor(db){
        this.AsztalAllapot = db.AsztalAllapot;
        this.sequelize = db.sequelize;
    }
    
    async getAsztalAllapot(){
        return await this.AsztalAllapot.findAll({
            order: [['id', 'ASC']]
        });
    }

    async getAsztalAllapotById(id){
        return await this.AsztalAllapot.findByPk(id);
    }

    async createAsztalAllapot(data){
        return await this.AsztalAllapot.create(data);
    }

    async updateAsztalAllapot(id, data){
        await this.AsztalAllapot.update(data, { where: { id: id } });
        return await this.AsztalAllapot.findByPk(id);
    }

    async deleteAsztalAllapot(id){
        const deleted = await this.AsztalAllapot.destroy({ where: { id: id } });
        return deleted > 0;
    }
}

module.exports = AsztalAllapotRepository;


