class IdopontRepository{
    constructor(db){
        this.Idopont = db.Idopont;
        this.sequelize = db.sequelize;
    }
    async getIdopontok(){
        return await this.Idopont.findAll({attributes: ["idopont_id", "foglalas_nap_ido"]})
    }
}


module.exports = IdopontRepository;