class IdopontService {
    constructor(db){
        this.idopontRepository = require("../repositories")(db).idopontRepository;
    }
    async getIdopontok(){
        return await this.idopontRepository.getIdopontok();
    }
}

module.exports = IdopontService;