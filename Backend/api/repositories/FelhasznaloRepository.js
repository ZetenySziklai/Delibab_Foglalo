class FelhasznaloRepository {
    constructor(db) {
        this.Felhasznalo = db.Felhasznalo;
        this.sequelize = db.sequelize;
    }

    async getUser() {
        return await this.Felhasznalo.findAll();
    }

    async getUserById(id) {
        return await this.Felhasznalo.findByPk(id);
    }

    async createUser(data, options = {}) {
        return await this.Felhasznalo.create(data, options);
    }

    async updateUser(id, data) {
        await this.Felhasznalo.update(data, { where: { id: id } });
        return await this.Felhasznalo.findByPk(id);
    }

    async deleteUser(id) {
        const deleted = await this.Felhasznalo.destroy({ where: { id: id } });
        return deleted > 0;
    }

    async getUserByEmail(email, options = {}) {
        return await this.Felhasznalo.findAll({ where: { email }, raw: true, ...options });
    }



    //kerdes hogy maradjon
    async getUserByPhone(telefonszam, options = {}) {
        const phoneNormalized = String(telefonszam).replace(/[\s-]/g, "");
        return await this.Felhasznalo.findAll({ where: { telefonszam: phoneNormalized }, raw: true, ...options });
    }

    async getUserWithDetails() {
        const results = await this.Felhasznalo.findAll({
            order: [['id', 'DESC']],
            raw: true
        });
        return results;
    }

    // GROUP BY - foglalások száma email szerint
    async getUserCountByEmail() {
        return await this.Felhasznalo.findAll({
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
    async getUsersByDateRange(startDate, endDate) {
        const results = await this.Felhasznalo.findAll({
            attributes: ['id', 'vezeteknev', 'keresztnev', 'email'],
            order: [['id', 'ASC']],
            raw: true
        });
        return results;
    }

    // Aggregáció - legtöbb foglalással rendelkező személyek
    async getTopUsers(limit = 5) {
        return await this.Felhasznalo.findAll({
            attributes: [
                'vezeteknev',
                'keresztnev',
                'email',
                [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'osszes_foglalas']
            ],
            group: ['Felhasznalo.id'],
            order: [[this.sequelize.literal('osszes_foglalas'), 'DESC']],
            limit: limit
        });
    }
}

module.exports = FelhasznaloRepository;
