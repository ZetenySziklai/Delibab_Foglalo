class UserRepository{
    constructor(db){
        this.User = db.User;
        this.sequelize = db.sequelize;
    }
    
    async getUser(){
        return await this.User.findAll();
    }

    async getUserById(id){
        return await this.User.findByPk(id);
    }

    async createUser(data){
        return await this.User.create(data);
    }

    async updateUser(id, data){
        await this.User.update(data, { where: { id: id } });
        return await this.User.findByPk(id);
    }

    async deleteUser(id){
        const deleted = await this.User.destroy({ where: { id: id } });
        return deleted > 0;
    }
}

module.exports = UserRepository;

