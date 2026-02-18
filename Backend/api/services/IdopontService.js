const { BadRequestError, NotFoundError } = require("../errors");

class IdopontService {
    constructor(db){
        this.idopontRepository = require("../repositories")(db).idopontRepository;
    }
    
    async getIdopont(){
        return await this.idopontRepository.getIdopont();
    }

    async createIdopont(data){
        if (data.kezdet === undefined || data.veg === undefined) {
            throw new BadRequestError("A kezdet és vég időpont kötelező mező");
        }

        if (data.kezdet < 0 || data.veg < 0 || data.kezdet >= data.veg) {
            throw new BadRequestError("Érvénytelen időpont értékek");
        }

        return await this.idopontRepository.createIdopont(data);
    }

    async getIdopontById(id){
        return await this.idopontRepository.getIdopontById(id);
    }

    async updateIdopont(id, data){
        if (data.kezdet !== undefined && data.veg !== undefined && data.kezdet >= data.veg) {
            throw new BadRequestError("A kezdet időpontnak korábbinak kell lennie, mint a vég időpontnak");
        }
        return await this.idopontRepository.updateIdopont(id, data);
    }

    async deleteIdopont(id){
        return await this.idopontRepository.deleteIdopont(id);
    }
}

module.exports = IdopontService;

