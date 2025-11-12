class EtkezesTipusaRepository{
    constructor(db){
        this.EtkezesTipusa = db.EtkezesTipusa;
        this.sequelize = db.sequelize;
    }
    
    async getEtkezesTipusa(){
        return await this.EtkezesTipusa.findAll({
            order: [['id', 'ASC']]
        });
    }

    async getEtkezesTipusaById(id){
        return await this.EtkezesTipusa.findByPk(id);
    }

    async createEtkezesTipusa(data){
        return await this.EtkezesTipusa.create(data);
    }

    async updateEtkezesTipusa(id, data){
        await this.EtkezesTipusa.update(data, { where: { id: id } });
        return await this.EtkezesTipusa.findByPk(id);
    }

    async deleteEtkezesTipusa(id){
        const deleted = await this.EtkezesTipusa.destroy({ where: { id: id } });
        return deleted > 0;
    }
}

module.exports = EtkezesTipusaRepository;


