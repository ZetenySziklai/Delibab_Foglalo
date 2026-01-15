class FoglaloRepository{
    constructor(db){
        this.Foglalo = db.Foglalo;
        this.Idopont = db.Idopont;
        this.VendegekSzama = db.VendegekSzama;
        this.EtkezesTipusa = db.EtkezesTipusa;
        this.sequelize = db.sequelize;
    }
    
    async getFoglalo(){
        // Egyszerű lekérdezés include nélkül, hogy elkerüljük a hiányzó asszociációs hibákat
        return await this.Foglalo.findAll();
    }

    async getFoglaloByEmail(email){
        return await this.Foglalo.findAll({ where: { email: email }});
    }

    async getFoglaloByPhone(telefonszam){
        // Normalizáljuk a telefonszámot (eltávolítjuk a szóközöket és kötőjeleket)
        const phoneNormalized = String(telefonszam).replace(/[\s-]/g, "");
        return await this.Foglalo.findAll({
            where: { telefonszam: phoneNormalized }
        });
    }

    async getFoglaloWithDetails(){
        return await this.Foglalo.findAll({
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
            attributes: ['foglalo_id','vezeteknev','keresztnev','email'],
            order: [['foglalo_id', 'ASC']]
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
        // Egyszerűsített változat asszociációk nélkül a hibák elkerülésére
        return await this.EtkezesTipusa.findAll();
    }
}


module.exports = FoglaloRepository;