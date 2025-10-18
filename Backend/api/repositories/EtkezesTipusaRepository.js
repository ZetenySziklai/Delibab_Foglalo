class EtkezesTipusaRepository{
    constructor(db){
        this.EtkezesTipusa = db.EtkezesTipusa;
        this.Foglalo = db.Foglalo;
        this.sequelize = db.sequelize;
    }
    
    async getEtkezesTipusa(){
        return await this.EtkezesTipusa.findAll({
            attributes: ["reggeli", "ebed","vacsora","etkezes_id"],
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev", "email"]
            }]
        });
    }

    async getEtkezesTipusaById(id){
        return await this.EtkezesTipusa.findOne({
            where: { etkezes_id: id },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev", "telefonszam"]
            }]
        });
    }

    async getEtkezesTipusaByType(type){
        const typeMap = {
            'reggeli': { reggeli: 1 },
            'ebed': { ebed: 1 },
            'vacsora': { vacsora: 1 }
        };
        
        return await this.EtkezesTipusa.findAll({
            where: typeMap[type] || {},
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev"]
            }]
        });
    }

    async getEtkezesTipusaByMealCount(count){
        return await this.EtkezesTipusa.findAll({
            where: {
                [this.sequelize.Sequelize.literal('reggeli + ebed + vacsora')]: count
            },
            include: [{
                model: this.Foglalo,
                attributes: ["vezeteknev", "keresztnev"]
            }]
        });
    }

    async createEtkezesTipusa(data){
        const created = await this.EtkezesTipusa.create(data);
        return created;
    }

    async updateEtkezesTipusa(id, data){
        await this.EtkezesTipusa.update(data, { where: { etkezes_id: id } });
        return await this.EtkezesTipusa.findOne({ where: { etkezes_id: id } });
    }

    // DELETE művelet - étkezés típusa törlése
    async deleteEtkezesTipusa(id){
        const deleted = await this.EtkezesTipusa.destroy({ where: { etkezes_id: id } });
        return deleted > 0;
    }

    // GROUP BY - étkezés típusok népszerűsége
    async getEtkezesTipusaStatistics(){
        return await this.EtkezesTipusa.findAll({
            attributes: [
                'reggeli',
                'ebed',
                'vacsora',
                [this.sequelize.literal('reggeli + ebed + vacsora'), 'osszesen'],
                [this.sequelize.fn('COUNT', this.sequelize.col('etkezes_id')), 'elofordulasok_szama']
            ],
            group: ['reggeli', 'ebed', 'vacsora'],
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('etkezes_id')), 
                '>=', 1
            ),
            order: [[this.sequelize.literal('elofordulasok_szama'), 'DESC']]
        });
    }

    // Összetett lekérdezés - étkezés típusok foglalókkal
    async getEtkezesTipusaWithFoglalok(){
        return await this.EtkezesTipusa.findAll({
            attributes: [
                'etkezes_id',
                'reggeli',
                'ebed',
                'vacsora',
                [this.sequelize.literal('reggeli + ebed + vacsora'), 'osszesen'],
                [this.sequelize.fn('COUNT', this.sequelize.col('Foglalos.foglalo_id')), 'foglalasok_szama']
            ],
            include: [{
                model: this.Foglalo,
                as: 'Foglalos',
                attributes: [],
                include: [{
                    model: this.VendegekSzama,
                    attributes: [
                        [this.sequelize.fn('AVG', this.sequelize.col('Foglalos.VendegekSzama.felnott')), 'atlagos_felnott'],
                        [this.sequelize.fn('AVG', this.sequelize.col('Foglalos.VendegekSzama.gyerek')), 'atlagos_gyerek']
                    ]
                }]
            }],
            group: ['EtkezesTipusa.etkezes_id'],
            order: [[this.sequelize.literal('foglalasok_szama'), 'DESC']]
        });
    }

    // Komplex lekérdezés - étkezés típusok időpont szerint
    async getEtkezesTipusaByTimeSlot(){
        return await this.EtkezesTipusa.findAll({
            attributes: [
                [this.sequelize.fn('HOUR', this.sequelize.col('Foglalos.Idopont.foglalas_nap_ido')), 'ora'],
                [this.sequelize.fn('SUM', this.sequelize.col('reggeli')), 'reggeli_szam'],
                [this.sequelize.fn('SUM', this.sequelize.col('ebed')), 'ebed_szam'],
                [this.sequelize.fn('SUM', this.sequelize.col('vacsora')), 'vacsora_szam'],
                [this.sequelize.fn('COUNT', this.sequelize.col('etkezes_id')), 'osszes_etkezes']
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
                this.sequelize.fn('COUNT', this.sequelize.col('etkezes_id')), 
                '>=', 1
            ),
            order: [[this.sequelize.literal('ora'), 'ASC']]
        });
    }

    // Aggregáció - legnépszerűbb étkezés kombinációk
    async getMostPopularEtkezesCombinations(limit = 10){
        return await this.EtkezesTipusa.findAll({
            attributes: [
                'reggeli',
                'ebed',
                'vacsora',
                [this.sequelize.literal('reggeli + ebed + vacsora'), 'osszesen'],
                [this.sequelize.fn('COUNT', this.sequelize.col('etkezes_id')), 'elofordulasok_szama'],
                [this.sequelize.fn('ROUND', this.sequelize.fn('AVG', this.sequelize.col('etkezes_id')), 2), 'atlagos_etkezes_id']
            ],
            group: ['reggeli', 'ebed', 'vacsora'],
            order: [[this.sequelize.literal('elofordulasok_szama'), 'DESC']],
            limit: limit
        });
    }

    // Komplex lekérdezés - étkezés típusok vendég számokkal
    async getEtkezesTipusaWithVendegekSzama(){
        return await this.EtkezesTipusa.findAll({
            attributes: [
                'etkezes_id',
                'reggeli',
                'ebed',
                'vacsora',
                [this.sequelize.literal('reggeli + ebed + vacsora'), 'osszesen'],
                [this.sequelize.fn('SUM', this.sequelize.col('Foglalos.VendegekSzama.felnott')), 'osszes_felnott'],
                [this.sequelize.fn('SUM', this.sequelize.col('Foglalos.VendegekSzama.gyerek')), 'osszes_gyerek'],
                [this.sequelize.fn('AVG', this.sequelize.col('Foglalos.VendegekSzama.felnott')), 'atlagos_felnott'],
                [this.sequelize.fn('AVG', this.sequelize.col('Foglalos.VendegekSzama.gyerek')), 'atlagos_gyerek']
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
            group: ['EtkezesTipusa.etkezes_id'],
            having: this.sequelize.where(
                this.sequelize.literal('reggeli + ebed + vacsora'), 
                '>', 0
            ),
            order: [[this.sequelize.literal('osszes_felnott'), 'DESC']]
        });
    }
}


module.exports = EtkezesTipusaRepository;