class IdopontRepository{
    constructor(db){
        this.Idopont = db.Idopont;
        this.Foglalo = db.Foglalo;
        this.sequelize = db.sequelize;
    }
    
    async getIdopontok(){
        return await this.Idopont.findAll({
            attributes: ["idopont_id", "foglalas_nap_ido"],
            order: [['foglalas_nap_ido', 'ASC']]
        });
    }

    async getIdopontById(id){
        return await this.Idopont.findOne({
            where: { idopont_id: id },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev", "email"]
            }]
        });
    }

    async getIdopontokByDate(date){
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        
        return await this.Idopont.findAll({
            where: {
                foglalas_nap_ido: {
                    [this.sequelize.Sequelize.Op.between]: [startDate, endDate]
                }
            },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev", "telefonszam"]
            }],
            order: [['foglalas_nap_ido', 'ASC']]
        });
    }

    async getUpcomingIdopontok(){
        const now = new Date();
        return await this.Idopont.findAll({
            where: {
                foglalas_nap_ido: {
                    [this.sequelize.Sequelize.Op.gte]: now
                }
            },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev"]
            }],
            order: [['foglalas_nap_ido', 'ASC']]
        });
    }

    async createIdopont(data){
        const created = await this.Idopont.create(data);
        return created;
    }

    async updateIdopont(id, data){
        await this.Idopont.update(data, { where: { idopont_id: id } });
        return await this.Idopont.findOne({ where: { idopont_id: id } });
    }

    // DELETE művelet - időpont törlése
    async deleteIdopont(id){
        const deleted = await this.Idopont.destroy({ where: { idopont_id: id } });
        return deleted > 0;
    }

    // GROUP BY - foglalások száma naponként
    async getIdopontokCountByDay(){
        return await this.Idopont.findAll({
            attributes: [
                [this.sequelize.fn('DATE', this.sequelize.col('foglalas_nap_ido')), 'nap'],
                [this.sequelize.fn('COUNT', this.sequelize.col('idopont_id')), 'foglalasok_szama']
            ],
            group: [this.sequelize.fn('DATE', this.sequelize.col('foglalas_nap_ido'))],
            order: [[this.sequelize.literal('nap'), 'DESC']]
        });
    }

    // Összetett lekérdezés - időpontok órák szerint csoportosítva
    async getIdopontokCountByHour(){
        return await this.Idopont.findAll({
            attributes: [
                [this.sequelize.fn('HOUR', this.sequelize.col('foglalas_nap_ido')), 'ora'],
                [this.sequelize.fn('COUNT', this.sequelize.col('idopont_id')), 'foglalasok_szama'],
                [this.sequelize.fn('AVG', this.sequelize.col('idopont_id')), 'atlagos_idopont']
            ],
            group: [this.sequelize.fn('HOUR', this.sequelize.col('foglalas_nap_ido'))],
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('idopont_id')), 
                '>=', 2
            ),
            order: [[this.sequelize.literal('foglalasok_szama'), 'DESC']]
        });
    }

    // Komplex lekérdezés - időpontok vendég számokkal
    async getIdopontokWithVendegekSzama(){
        return await this.Idopont.findAll({
            attributes: [
                'idopont_id',
                'foglalas_nap_ido',
                [this.sequelize.fn('SUM', this.sequelize.col('Foglalos.VendegekSzama.felnott')), 'osszes_felnott'],
                [this.sequelize.fn('SUM', this.sequelize.col('Foglalos.VendegekSzama.gyerek')), 'osszes_gyerek'],
                [this.sequelize.fn('COUNT', this.sequelize.col('Foglalos.foglalo_id')), 'foglalasok_szama']
            ],
            include: [{
                model: this.Foglalo,
                as: 'Foglalos',
                attributes: [],
                include: [{
                    model: this.VendegekSzama,
                    attributes: []
                }]
            }],
            group: ['Idopont.idopont_id'],
            order: [[this.sequelize.literal('osszes_felnott'), 'DESC']]
        });
    }

    // Aggregáció - legnépszerűbb időpontok
    async getMostPopularTimeSlots(limit = 10){
        return await this.Idopont.findAll({
            attributes: [
                [this.sequelize.fn('DATE_FORMAT', this.sequelize.col('foglalas_nap_ido'), '%H:00'), 'idopont'],
                [this.sequelize.fn('COUNT', this.sequelize.col('idopont_id')), 'foglalasok_szama'],
                [this.sequelize.fn('MIN', this.sequelize.col('foglalas_nap_ido')), 'elso_foglalas'],
                [this.sequelize.fn('MAX', this.sequelize.col('foglalas_nap_ido')), 'utolso_foglalas']
            ],
            group: [this.sequelize.fn('DATE_FORMAT', this.sequelize.col('foglalas_nap_ido'), '%H:00')],
            order: [[this.sequelize.literal('foglalasok_szama'), 'DESC']],
            limit: limit
        });
    }
}


module.exports = IdopontRepository;