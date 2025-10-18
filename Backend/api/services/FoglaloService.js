class FoglaloService {
    constructor(db){
        this.foglaloRepository = require("../repositories")(db).foglaloRepository;
    }
    
    async getFoglalo(){
        return await this.foglaloRepository.getFoglalo();
    }

    async getFoglaloByEmail(email){
        if (!email || !email.includes('@')) {
            throw new Error("Érvényes email címet adjon meg");
        }
        return await this.foglaloRepository.getFoglaloByEmail(email);
    }

    async getFoglaloWithDetails(){
        return await this.foglaloRepository.getFoglaloWithDetails();
    }

    async createFoglalo(data){
        // Validálás
        if (!data.vezeteknev || !data.keresztnev || !data.email || !data.telefonszam) {
            throw new Error("Minden kötelező mezőt ki kell tölteni");
        }
        
        if (!data.email.includes('@')) {
            throw new Error("Érvényes email címet adjon meg");
        }

        return await this.foglaloRepository.createFoglalo(data);
    }

    async updateFoglalo(id, data){
        const existing = await this.foglaloRepository.getFoglaloByEmail(data.email || '');
        if (existing && existing.length > 0 && existing[0].foglalo_id !== parseInt(id)) {
            throw new Error("Ez az email cím már használatban van");
        }
        
        return await this.foglaloRepository.updateFoglalo(id, data);
    }
}

module.exports = FoglaloService;