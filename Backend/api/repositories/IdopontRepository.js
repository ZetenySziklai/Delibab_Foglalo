class IdopontRepository{
    constructor(db){
        this.Idopont = db.Idopont;
        this.Foglalas = db.Foglalas;
        this.sequelize = db.sequelize;
    }
    
    async getIdopont(){
        return await this.Idopont.findAll();
    }

    async createIdopont(data){
        return await this.Idopont.create(data);
    }

    async getIdopontById(id){
        return await this.Idopont.findByPk(id);
    }

    async updateIdopont(id, data){
        await this.Idopont.update(data, { where: { id: id } });
        return await this.getIdopontById(id);
    }

    async deleteIdopont(id){
        const deleted = await this.Idopont.destroy({ where: { id: id } });
        return deleted > 0;
    }
}

module.exports = IdopontRepository;


