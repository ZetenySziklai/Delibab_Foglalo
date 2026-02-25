class FoglalasRepository{
    constructor(db){
        this.Foglalas = db.Foglalas;
        this.Felhasznalo = db.Felhasznalo;
        this.Asztal = db.Asztal;
    }
    
    async getFoglalas(){
        return await this.Foglalas.findAll({
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    attributes: ["helyek_szama"]
                }
            ]
        });
    }

    async createFoglalas(data){
        return await this.Foglalas.create(data);
    }

    async getFoglalasById(id){
        return await this.Foglalas.findByPk(id, {
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    attributes: ["helyek_szama"]
                }
            ]
        });
    }

    async updateFoglalas(id, data){
        await this.Foglalas.update(data, { where: { id: id } });
        return await this.getFoglalasById(id);
    }

    async deleteFoglalas(id){
        const deleted = await this.Foglalas.destroy({ where: { id: id } });
        return deleted > 0;
    }

    async getFoglaltIdopontok(datum, asztalId){
        const { Op } = require('sequelize');
        
        // Lekérjük az adott dátumra és asztalra vonatkozó foglalásokat (foglalt időpontok)
        const foglalasok = await this.Foglalas.findAll({
            where: {
                asztal_id: asztalId,
                foglalas_datum: {
                    [Op.gte]: new Date(datum + ' 00:00:00'),
                    [Op.lt]: new Date(new Date(datum).setDate(new Date(datum).getDate() + 1))
                }
            },
            // Az asztal_id-t is visszaadjuk, hogy a tesztben ellenőrizhető legyen
            attributes: ['id', 'foglalas_datum', 'user_id', 'asztal_id']
        });
        
        return foglalasok;
    }

    async getFoglalasByDatum(datum){
        const { Op } = require('sequelize');
        
        return await this.Foglalas.findAll({
            where: {
                foglalas_datum: {
                    [Op.gte]: new Date(datum + ' 00:00:00'),
                    [Op.lt]: new Date(new Date(datum).setDate(new Date(datum).getDate() + 1))
                }
            },
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    attributes: ["helyek_szama"]
                }
            ]
        });
    }

    async getFoglalasByUser(userId){
        return await this.Foglalas.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: this.Felhasznalo,
                    attributes: ["vezeteknev", "keresztnev", "email", "telefonszam"]
                },
                {
                    model: this.Asztal,
                    attributes: ["helyek_szama"]
                }
            ]
        });
    }
}

module.exports = FoglalasRepository;
