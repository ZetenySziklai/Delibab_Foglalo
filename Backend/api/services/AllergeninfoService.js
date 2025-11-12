class AllergeninfoService {
    constructor(db){
        this.allergeninfoRepository = require("../repositories")(db).allergeninfoRepository;
        this.allergenRepository = require("../repositories")(db).allergenRepository;
        this.foglalasRepository = require("../repositories")(db).foglalasRepository;
    }
    
    async getAllergeninfo(){
        return await this.allergeninfoRepository.getAllergeninfo();
    }

    async getAllergeninfoById(id){
        return await this.allergeninfoRepository.getAllergeninfoById(id);
    }

    async createAllergeninfo(data){
        if (!data.allergen_id || !data.foglalas_id) {
            throw new Error("Allergen ID és Foglalás ID kötelező");
        }

        // Allergen létezik-e
        const allergen = await this.allergenRepository.getAllergenById(data.allergen_id);
        if (!allergen) {
            throw new Error("A megadott allergen nem létezik");
        }

        // Foglalás létezik-e
        const foglalas = await this.foglalasRepository.getFoglalasById(data.foglalas_id);
        if (!foglalas) {
            throw new Error("A megadott foglalás nem létezik");
        }

        return await this.allergeninfoRepository.createAllergeninfo(data);
    }

    async updateAllergeninfo(id, data){
        return await this.allergeninfoRepository.updateAllergeninfo(id, data);
    }

    async deleteAllergeninfo(id){
        return await this.allergeninfoRepository.deleteAllergeninfo(id);
    }

    async getAllergeninfoByFoglalas(foglalasId){
        if (!foglalasId) {
            throw new Error("Foglalás ID kötelező");
        }
        return await this.allergeninfoRepository.getAllergeninfoByFoglalas(foglalasId);
    }

    async deleteAllergeninfoByFoglalas(foglalasId){
        if (!foglalasId) {
            throw new Error("Foglalás ID kötelező");
        }
        return await this.allergeninfoRepository.deleteAllergeninfoByFoglalas(foglalasId);
    }
}

module.exports = AllergeninfoService;


