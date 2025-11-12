class MegjegyzesService {
    constructor(db){
        this.megjegyzesRepository = require("../repositories")(db).megjegyzesRepository;
    }
    
    async getMegjegyzes(){
        return await this.megjegyzesRepository.getMegjegyzes();
    }

    async getMegjegyzesById(id){
        return await this.megjegyzesRepository.getMegjegyzesById(id);
    }

    async createMegjegyzes(data){
        if (!data.szoveg) {
            throw new Error("Megjegyzés szövege kötelező");
        }

        // Szöveg nem lehet üres
        if (!data.szoveg.trim()) {
            throw new Error("A megjegyzés szövege nem lehet üres");
        }

        // Szöveg hossz ellenőrzése (max 500 karakter)
        if (data.szoveg.length > 500) {
            throw new Error("A megjegyzés maximum 500 karakter lehet");
        }

        return await this.megjegyzesRepository.createMegjegyzes(data);
    }

    async updateMegjegyzes(id, data){
        return await this.megjegyzesRepository.updateMegjegyzes(id, data);
    }

    async deleteMegjegyzes(id){
        return await this.megjegyzesRepository.deleteMegjegyzes(id);
    }
}

module.exports = MegjegyzesService;


