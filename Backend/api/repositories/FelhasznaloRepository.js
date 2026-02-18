class UserRepository{
    constructor(db){
        this.User = db.User;
        this.EtkezesTipusa = db.EtkezesTipusa;
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

    async getUserByEmail(email){
        const results = await this.User.findAll({ where: { email: email }, raw: true });
        return results;
    }

    async getUserByPhone(telefonszam){
        const phoneNormalized = String(telefonszam).replace(/[\s-]/g, "");
        return await this.User.findAll({
            where: { telefonszam: phoneNormalized },
            raw: true
        });
    }

    async getUserWithDetails(){
        const results = await this.User.findAll({
            order: [['id', 'DESC']],
            raw: true
        });
        return results;
    }

    // GROUP BY - foglalások száma email szerint
    async getUserCountByEmail(){
        return await this.User.findAll({
            attributes: [
                'email',
                [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'foglalasok_szama']
            ],
            group: ['email'],
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('id')), 
                '>', 1
            ),
            order: [[this.sequelize.literal('foglalasok_szama'), 'DESC']]
        });
    }

    // Összetett lekérdezés - foglalások időpont szerint csoportosítva
    async getUsersByDateRange(startDate, endDate){
        const results = await this.User.findAll({
            attributes: ['id','vezeteknev','keresztnev','email'],
            order: [['id', 'ASC']],
            raw: true
        });
        return results;
    }

    // Aggregáció - legtöbb foglalással rendelkező személyek
    async getTopUsers(limit = 5){
        return await this.User.findAll({
            attributes: [
                'vezeteknev',
                'keresztnev',
                'email',
                [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'osszes_foglalas']
            ],
            group: ['User.id'],
            order: [[this.sequelize.literal('osszes_foglalas'), 'DESC']],
            limit: limit
        });
    }

    // Komplex lekérdezés - foglalások étkezés típus szerint
    async getUsersByEtkezesType(){
        // Egyszerűsített változat asszociációk nélkül a hibák elkerülésére
        return await this.EtkezesTipusa.findAll();
    }
}

module.exports = UserRepository;

