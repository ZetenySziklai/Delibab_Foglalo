class FelhasznaloRepository {
    constructor(db) {
        this.Felhasznalo = db.Felhasznalo;
        this.sequelize = db.sequelize;
    }

    async getUser(options = {}) {
        return await this.Felhasznalo.findAll({
            transaction: options.transaction,
        });
    }

    async getUserById(id, options = {}) {
        return await this.Felhasznalo.findByPk(id, {
            transaction: options.transaction,
        });
    }

    async createUser(data, options = {}) {
        return await this.Felhasznalo.create(data, {
            transaction: options.transaction,
        });
    }

    async updateUser(id, data, options = {}) {
        await this.Felhasznalo.update(data, {
            where: { id },
            transaction: options.transaction,
        });
        return await this.getUserById(id, options);
    }

    async deleteUser(id, options = {}) {
        const deleted = await this.Felhasznalo.destroy({
            where: { id },
            transaction: options.transaction,
        });
        return deleted > 0;
    }

    async getUserByEmail(email, options = {}) {
        return await this.Felhasznalo.findAll({
            where: { email },
            raw: true,
            transaction: options.transaction,
            lock: options.lock,
        });
    }

    async getUserByPhone(telefonszam, options = {}) {
        const phoneNormalized = String(telefonszam).replace(/[\s-]/g, "");
        return await this.Felhasznalo.findAll({
            where: { telefonszam: phoneNormalized },
            raw: true,
            transaction: options.transaction,
            lock: options.lock,
        });
    }

    async getUserWithDetails(options = {}) {
        return await this.Felhasznalo.findAll({
            order: [['id', 'DESC']],
            raw: true,
            transaction: options.transaction,
        });
    }

    async getUserCountByEmail(options = {}) {
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
            order: [[this.sequelize.literal('foglalasok_szama'), 'DESC']],
            transaction: options.transaction,
        });
    }

    async getUsersByDateRange(startDate, endDate, options = {}) {
        return await this.Felhasznalo.findAll({
            attributes: ['id', 'vezeteknev', 'keresztnev', 'email'],
            order: [['id', 'ASC']],
            raw: true,
            transaction: options.transaction,
        });
    }

    async getTopUsers(limit = 5, options = {}) {
        return await this.Felhasznalo.findAll({
            attributes: [
                'vezeteknev',
                'keresztnev',
                'email',
                [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'osszes_foglalas']
            ],
            group: ['Felhasznalo.id'],
            order: [[this.sequelize.literal('osszes_foglalas'), 'DESC']],
            limit,
            transaction: options.transaction,
        });
    }
}

module.exports = FelhasznaloRepository;