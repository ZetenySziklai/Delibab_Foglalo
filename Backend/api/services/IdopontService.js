class IdopontService {
    constructor(db){
        this.idopontRepository = require("../repositories")(db).idopontRepository;
    }
    
    async getIdopontok(){
        return await this.idopontRepository.getIdopontok();
    }

    async getIdopontById(id){
        if (!id || isNaN(id)) {
            throw new Error("Érvényes ID-t adjon meg");
        }
        return await this.idopontRepository.getIdopontById(id);
    }

    async getIdopontokByDate(date){
        if (!date) {
            throw new Error("Dátum megadása kötelező");
        }
        
        const inputDate = new Date(date);
        if (isNaN(inputDate.getTime())) {
            throw new Error("Érvényes dátumot adjon meg");
        }
        
        return await this.idopontRepository.getIdopontokByDate(date);
    }

    async getUpcomingIdopontok(){
        return await this.idopontRepository.getUpcomingIdopontok();
    }

    async createIdopont(data){
        if (!data.foglalas_nap_ido) {
            throw new Error("Foglalás dátuma kötelező");
        }
        
        const inputDate = new Date(data.foglalas_nap_ido);
        if (isNaN(inputDate.getTime())) {
            throw new Error("Érvényes dátumot adjon meg");
        }
        
        if (inputDate < new Date()) {
            throw new Error("A foglalás dátuma nem lehet a múltban");
        }

        return await this.idopontRepository.createIdopont(data);
    }

    async updateIdopont(id, data){
        if (!id || isNaN(id)) {
            throw new Error("Érvényes ID-t adjon meg");
        }
        
        if (data.foglalas_nap_ido) {
            const inputDate = new Date(data.foglalas_nap_ido);
            if (isNaN(inputDate.getTime())) {
                throw new Error("Érvényes dátumot adjon meg");
            }
        }
        
        return await this.idopontRepository.updateIdopont(id, data);
    }
}

module.exports = IdopontService;