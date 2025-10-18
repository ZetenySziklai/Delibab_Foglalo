class VendegekSzamaRepository{
    constructor(db){
        this.VendegekSzama = db.VendegekSzama;
        this.Foglalo = db.Foglalo;
        this.sequelize = db.sequelize;
    }
    
    async getVendegekSzama(){
        return await this.VendegekSzama.findAll({
            attributes: ["felnott", "gyerek","vendeg_id"],
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev", "email"]
            }]
        });
    }

    async getVendegekSzamaById(id){
        return await this.VendegekSzama.findOne({
            where: { vendeg_id: id },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev", "telefonszam"]
            }]
        });
    }

    async getVendegekSzamaByTotal(total){
        return await this.VendegekSzama.findAll({
            where: {
                [this.sequelize.Sequelize.literal('felnott + gyerek')]: total
            },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev"]
            }]
        });
    }

    async getVendegekSzamaByChildrenCount(gyerekCount){
        return await this.VendegekSzama.findAll({
            where: { gyerek: gyerekCount },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev"]
            }]
        });
    }

    async createVendegekSzama(data){
        const created = await this.VendegekSzama.create(data);
        return created;
    }

    async updateVendegekSzama(id, data){
        await this.VendegekSzama.update(data, { where: { vendeg_id: id } });
        return await this.VendegekSzama.findOne({ where: { vendeg_id: id } });
    }

    // DELETE művelet - vendég szám törlése
    async deleteVendegekSzama(id){
        const deleted = await this.VendegekSzama.destroy({ where: { vendeg_id: id } });
        return deleted > 0;
    }

    // GROUP BY - vendég számok csoportosítása
    async getVendegekSzamaStatistics(){
        return await this.VendegekSzama.findAll({
            attributes: [
                'felnott',
                'gyerek',
                [this.sequelize.literal('felnott + gyerek'), 'osszesen'],
                [this.sequelize.fn('COUNT', this.sequelize.col('vendeg_id')), 'elofordulasok_szama']
            ],
            group: ['felnott', 'gyerek'],
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('vendeg_id')), 
                '>=', 1
            ),
            order: [[this.sequelize.literal('osszesen'), 'DESC']]
        });
    }

    // Összetett lekérdezés - átlagos vendég számok
    async getAverageVendegekSzama(){
        return await this.VendegekSzama.findAll({
            attributes: [
                [this.sequelize.fn('AVG', this.sequelize.col('felnott')), 'atlagos_felnott'],
                [this.sequelize.fn('AVG', this.sequelize.col('gyerek')), 'atlagos_gyerek'],
                [this.sequelize.fn('AVG', this.sequelize.literal('felnott + gyerek')), 'atlagos_osszesen'],
                [this.sequelize.fn('MIN', this.sequelize.col('felnott')), 'minimum_felnott'],
                [this.sequelize.fn('MAX', this.sequelize.col('felnott')), 'maximum_felnott'],
                [this.sequelize.fn('MIN', this.sequelize.col('gyerek')), 'minimum_gyerek'],
                [this.sequelize.fn('MAX', this.sequelize.col('gyerek')), 'maximum_gyerek'],
                [this.sequelize.fn('COUNT', this.sequelize.col('vendeg_id')), 'osszes_foglalas']
            ]
        });
    }

    // Komplex lekérdezés - vendég számok foglalókkal
    async getVendegekSzamaWithFoglalok(){
        return await this.VendegekSzama.findAll({
            attributes: [
                'vendeg_id',
                'felnott',
                'gyerek',
                [this.sequelize.literal('felnott + gyerek'), 'osszesen'],
                [this.sequelize.fn('COUNT', this.sequelize.col('Foglalos.foglalo_id')), 'foglalasok_szama']
            ],
            include: [{
                model: this.Foglalo,
                as: 'Foglalos',
                attributes: [],
                include: [{
                    model: this.Idopont,
                    attributes: [
                        [this.sequelize.fn('MIN', this.sequelize.col('Foglalos.Idopont.foglalas_nap_ido')), 'elso_foglalas'],
                        [this.sequelize.fn('MAX', this.sequelize.col('Foglalos.Idopont.foglalas_nap_ido')), 'utolso_foglalas']
                    ]
                }]
            }],
            group: ['VendegekSzama.vendeg_id'],
            having: this.sequelize.where(
                this.sequelize.literal('felnott + gyerek'), 
                '>', 4
            ),
            order: [[this.sequelize.literal('foglalasok_szama'), 'DESC']]
        });
    }

    // Aggregáció - legnépszerűbb vendég számok
    async getMostPopularVendegekSzama(limit = 10){
        return await this.VendegekSzama.findAll({
            attributes: [
                'felnott',
                'gyerek',
                [this.sequelize.literal('felnott + gyerek'), 'osszesen'],
                [this.sequelize.fn('COUNT', this.sequelize.col('vendeg_id')), 'elofordulasok_szama'],
                [this.sequelize.fn('ROUND', this.sequelize.fn('AVG', this.sequelize.col('vendeg_id')), 2), 'atlagos_vendeg_id']
            ],
            group: ['felnott', 'gyerek'],
            order: [[this.sequelize.literal('elofordulasok_szama'), 'DESC']],
            limit: limit
        });
    }

    // Komplex lekérdezés - vendég számok időpont szerint
    async getVendegekSzamaByTimeSlot(){
        return await this.VendegekSzama.findAll({
            attributes: [
                [this.sequelize.fn('HOUR', this.sequelize.col('Foglalos.Idopont.foglalas_nap_ido')), 'ora'],
                [this.sequelize.fn('AVG', this.sequelize.col('felnott')), 'atlagos_felnott_ora'],
                [this.sequelize.fn('AVG', this.sequelize.col('gyerek')), 'atlagos_gyerek_ora'],
                [this.sequelize.fn('COUNT', this.sequelize.col('vendeg_id')), 'foglalasok_szama_ora']
            ],
            include: [{
                model: this.Foglalo,
                as: 'Foglalos',
                attributes: [],
                include: [{
                    model: this.Idopont,
                    attributes: []
                }]
            }],
            group: [this.sequelize.fn('HOUR', this.sequelize.col('Foglalos.Idopont.foglalas_nap_ido'))],
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('vendeg_id')), 
                '>=', 2
            ),
            order: [[this.sequelize.literal('ora'), 'ASC']]
        });
    }
}


module.exports = VendegekSzamaRepository;