class EtkezesTipusaService {
    constructor(db){
        this.etkezesTipusaRepository = require("../repositories")(db).etkezesTipusaRepository;
    }
    
    async getEtkezesTipusa(){
        return await this.etkezesTipusaRepository.getEtkezesTipusa();
    }

    async getEtkezesTipusaById(id){
        return await this.etkezesTipusaRepository.getEtkezesTipusaById(id);
    }

    async createEtkezesTipusa(data){
        if (!data.nev) {
            throw new Error("Étkezés típus név kötelező");
        }

        // Név nem lehet üres
        if (!data.nev.trim()) {
            throw new Error("Az étkezés típus név nem lehet üres");
        }

        // Név hossz ellenőrzése (max 50 karakter)
        if (data.nev.length > 50) {
            throw new Error("Az étkezés típus név maximum 50 karakter lehet");
        }

        return await this.etkezesTipusaRepository.createEtkezesTipusa(data);
    }

    async updateEtkezesTipusa(id, data){
        return await this.etkezesTipusaRepository.updateEtkezesTipusa(id, data);
    }

    async deleteEtkezesTipusa(id){
        return await this.etkezesTipusaRepository.deleteEtkezesTipusa(id);
    }
}

module.exports = EtkezesTipusaService;



