class FoglaloRepository{
    constructor(db){
        this.Foglalo = db.Foglalo;
        this.Idopont = db.Idopont;
        this.VendegekSzama = db.VendegekSzama;
        this.EtkezesTipusa = db.EtkezesTipusa;
        this.sequelize = db.sequelize;
    }
    
    async getFoglalo(){
        return await this.Foglalo.findAll({
            attributes: ["vezeteknev", "keresztnev", "telefonszam","email","megjegyzes","foglalo_id","idopont_id","vendeg_id","etkezes_id"],
            include: [
                {
                    model: this.Idopont,
                    attributes: ["foglalas_nap_ido"]
                },
                {
                    model: this.VendegekSzama,
                    attributes: ["felnott", "gyerek"]
                },
                {
                    model: this.EtkezesTipusa,
                    attributes: ["reggeli", "ebed", "vacsora"]
                }
            ]
        });
    }

    async getFoglaloByEmail(email){
        return await this.Foglalo.findAll({
            where: { email: email },
            include: [
                {
                    model: this.Idopont,
                    attributes: ["foglalas_nap_ido"]
                },
                {
                    model: this.VendegekSzama,
                    attributes: ["felnott", "gyerek"]
                }
            ]
        });
    }

    async getFoglaloWithDetails(){
        return await this.Foglalo.findAll({
            include: [
                {
                    model: this.Idopont,
                    attributes: ["foglalas_nap_ido"]
                },
                {
                    model: this.VendegekSzama,
                    attributes: ["felnott", "gyerek"]
                },
                {
                    model: this.EtkezesTipusa,
                    attributes: ["reggeli", "ebed", "vacsora"]
                }
            ],
            order: [['foglalo_id', 'DESC']]
        });
    }

    async createFoglalo(data){
        const created = await this.Foglalo.create(data);
        return created;
    }

    async updateFoglalo(id, data){
        await this.Foglalo.update(data, { where: { foglalo_id: id } });
        return await this.Foglalo.findOne({ where: { foglalo_id: id } });
    }

    // DELETE művelet - foglaló törlése
    async deleteFoglalo(id){
        const deleted = await this.Foglalo.destroy({ where: { foglalo_id: id } });
        return deleted > 0;
    }

    // GROUP BY - foglalások száma email szerint
    async getFoglaloCountByEmail(){
        return await this.Foglalo.findAll({
            attributes: [
                'email',
                [this.sequelize.fn('COUNT', this.sequelize.col('foglalo_id')), 'foglalasok_szama']
            ],
            group: ['email'],
            having: this.sequelize.where(
                this.sequelize.fn('COUNT', this.sequelize.col('foglalo_id')), 
                '>', 1
            ),
            order: [[this.sequelize.literal('foglalasok_szama'), 'DESC']]
        });
    }

    // Összetett lekérdezés - foglalások időpont szerint csoportosítva
    async getFoglalokByDateRange(startDate, endDate){
        return await this.Foglalo.findAll({
            include: [{
                model: this.Idopont,
                where: {
                    foglalas_nap_ido: {
                        [this.sequelize.Sequelize.Op.between]: [startDate, endDate]
                    }
                },
                attributes: ['foglalas_nap_ido']
            }],
            attributes: [
                'foglalo_id',
                'vezeteknev',
                'keresztnev',
                'email'
            ],
            order: [[{model: this.Idopont}, 'foglalas_nap_ido', 'ASC']]
        });
    }

    // Aggregáció - legtöbb foglalással rendelkező személyek
    async getTopFoglalok(limit = 5){
        return await this.Foglalo.findAll({
            attributes: [
                'vezeteknev',
                'keresztnev',
                'email',
                [this.sequelize.fn('COUNT', this.sequelize.col('foglalo_id')), 'osszes_foglalas']
            ],
            include: [{
                model: this.VendegekSzama,
                attributes: [
                    [this.sequelize.fn('SUM', this.sequelize.col('VendegekSzama.felnott')), 'osszes_felnott'],
                    [this.sequelize.fn('SUM', this.sequelize.col('VendegekSzama.gyerek')), 'osszes_gyerek']
                ]
            }],
            group: ['Foglalo.foglalo_id'],
            order: [[this.sequelize.literal('osszes_foglalas'), 'DESC']],
            limit: limit
        });
    }

    // Komplex lekérdezés - foglalások étkezés típus szerint
    async getFoglalokByEtkezesType(){
        return await this.EtkezesTipusa.findAll({
            attributes: [
                'etkezes_id',
                'reggeli',
                'ebed', 
                'vacsora',
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
}


module.exports = FoglaloRepository;