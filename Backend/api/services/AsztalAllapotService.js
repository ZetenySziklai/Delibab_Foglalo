class AsztalAllapotService {
    constructor(db){
        this.asztalAllapotRepository = require("../repositories")(db).asztalAllapotRepository;
    }
    
    async getAsztalAllapot(){
        return await this.asztalAllapotRepository.getAsztalAllapot();
    }

    async getAsztalAllapotById(id){
        return await this.asztalAllapotRepository.getAsztalAllapotById(id);
    }

    async createAsztalAllapot(data){
        if (!data.nev) {
            throw new Error("Asztal állapot név kötelező");
        }

        // Név nem lehet üres
        if (!data.nev.trim()) {
            throw new Error("Az asztal állapot név nem lehet üres");
        }

        // Név hossz ellenőrzése (max 50 karakter)
        if (data.nev.length > 50) {
            throw new Error("Az asztal állapot név maximum 50 karakter lehet");
        }

        return await this.asztalAllapotRepository.createAsztalAllapot(data);
    }

    async updateAsztalAllapot(id, data){
        return await this.asztalAllapotRepository.updateAsztalAllapot(id, data);
    }

    async deleteAsztalAllapot(id){
        return await this.asztalAllapotRepository.deleteAsztalAllapot(id);
    }
}

module.exports = AsztalAllapotService;



