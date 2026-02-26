class FoglalasiAdatokRepository {
    constructor(db) {
        this.FoglalasiAdatok = db.FoglalasiAdatok;
        this.Foglalas = db.Foglalas;
    }

    async getFoglalasiAdatok() {
        return await this.FoglalasiAdatok.findAll({
            include: [{
                model: this.Foglalas,
                attributes: ["id"]
            }]
        });
    }

    async createFoglalasiAdatok(data, options = {}) {
        return await this.FoglalasiAdatok.create(data, options);
    }

    async getFoglalasiAdatokById(id) {
        return await this.FoglalasiAdatok.findByPk(id, {
            include: [{
                model: this.Foglalas,
                attributes: ["id"]
            }]
        });
    }

    async updateFoglalasiAdatok(id, data) {
        await this.FoglalasiAdatok.update(data, { where: { id: id } });
        return await this.getFoglalasiAdatokById(id);
    }

    async deleteFoglalasiAdatok(id) {
        const deleted = await this.FoglalasiAdatok.destroy({ where: { id: id } });
        return deleted > 0;
    }
}

module.exports = FoglalasiAdatokRepository;


