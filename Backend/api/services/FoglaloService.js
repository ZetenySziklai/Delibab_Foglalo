const { BadRequestError } = require("../errors");

class FoglaloService {
    constructor(db){
        this.foglaloRepository = require("../repositories")(db).foglaloRepository;
    }
    
    async getFoglalo(){
        return await this.foglaloRepository.getFoglalo();
    }

    async getFoglaloByEmail(email){
        if (!email || !email.includes('@')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }
        return await this.foglaloRepository.getFoglaloByEmail(email);
    }

    async getFoglaloWithDetails(){
        return await this.foglaloRepository.getFoglaloWithDetails();
    }

    async createFoglalo(data){
        // Validálás
        if (!data.vezeteknev || !data.keresztnev || !data.email || !data.telefonszam) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }
        
        if (!data.email.includes('@')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }

        // Telefonszám: csak számok (+ előjel és szóköz/-, 7-15 számjegy)
        const phoneNormalized = String(data.telefonszam).replace(/[\s-]/g, "");
        if (!/^\+?\d{7,15}$/.test(phoneNormalized)) {
            throw new BadRequestError("A telefonszám csak szám lehet (7-15 számjegy)");
        }

        // Duplikáció tiltása: ugyanaz az email vagy telefonszám már szerepel
        const existingByEmail = await this.foglaloRepository.getFoglaloByEmail(data.email);
        // Normalizált telefonszámot használunk a duplikáció ellenőrzéshez
        const existingByPhone = await this.foglaloRepository.getFoglaloByPhone(phoneNormalized);
        if ((existingByEmail && existingByEmail.length > 0) || (existingByPhone && existingByPhone.length > 0)) {
            throw new BadRequestError("Ezzel az emaillel vagy telefonszámmal már van foglaló");
        }

        // Normalizált telefonszámot mentjük az adatbázisba
        data.telefonszam = phoneNormalized;
        return await this.foglaloRepository.createFoglalo(data);
    }

    async updateFoglalo(id, data){
        if (data.email) {
            const existing = await this.foglaloRepository.getFoglaloByEmail(data.email);
            if (existing && existing.length > 0 && existing[0].foglalo_id !== parseInt(id)) {
                throw new BadRequestError("Ez az email cím már használatban van");
            }
        }
        
        return await this.foglaloRepository.updateFoglalo(id, data);
    }

    async deleteFoglalo(id){
        return await this.foglaloRepository.deleteFoglalo(id);
    }

    async getFoglaloCountByEmail(){
        return await this.foglaloRepository.getFoglaloCountByEmail();
    }

    async getTopFoglalok(limit){
        return await this.foglaloRepository.getTopFoglalok(limit);
    }

    async getFoglalokByDateRange(startDate, endDate){
        if (!startDate || !endDate) {
            throw new BadRequestError("Kezdő és végdátum megadása kötelező");
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new BadRequestError("Érvényes dátumokat adjon meg");
        }
        
        if (start > end) {
            throw new BadRequestError("A kezdő dátum nem lehet későbbi, mint a végdátum");
        }
        
        return await this.foglaloRepository.getFoglalokByDateRange(startDate, endDate);
    }

    async getFoglalokByEtkezesType(){
        return await this.foglaloRepository.getFoglalokByEtkezesType();
    }
}

module.exports = FoglaloService;