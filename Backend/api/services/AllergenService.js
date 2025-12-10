const { BadRequestError } = require("../errors");

class AllergenService {
    constructor(db){
        this.allergenRepository = require("../repositories")(db).allergenRepository;
    }
    
    async getAllergen(){
        return await this.allergenRepository.getAllergen();
    }

    async getAllergenById(id){
        return await this.allergenRepository.getAllergenById(id);
    }

    async createAllergen(data){
        if (!data.nev) {
            throw new BadRequestError("Allergen név kötelező");
        }

        // Név nem lehet üres
        if (!data.nev.trim()) {
            throw new BadRequestError("Az allergen név nem lehet üres");
        }

        // Név hossz ellenőrzése (max 50 karakter)
        if (data.nev.length > 50) {
            throw new BadRequestError("Az allergen név maximum 50 karakter lehet");
        }

        return await this.allergenRepository.createAllergen(data);
    }

    async updateAllergen(id, data){
        if (data.nev !== undefined) {
            if (!data.nev || !data.nev.trim()) {
                throw new BadRequestError("Az allergen név nem lehet üres");
            }
            if (data.nev.length > 50) {
                throw new BadRequestError("Az allergen név maximum 50 karakter lehet");
            }
        }
        return await this.allergenRepository.updateAllergen(id, data);
    }

    async deleteAllergen(id){
        return await this.allergenRepository.deleteAllergen(id);
    }
}

module.exports = AllergenService;


