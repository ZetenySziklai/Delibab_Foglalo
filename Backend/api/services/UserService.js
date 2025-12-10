const { BadRequestError } = require("../errors");

class UserService {
    constructor(db){
        this.userRepository = require("../repositories")(db).userRepository;
    }
    
    async getUser(){
        return await this.userRepository.getUser();
    }

    async getUserById(id){
        return await this.userRepository.getUserById(id);
    }

    async createUser(data){
        if (!data.vezeteknev || !data.keresztnev || !data.email || !data.telefonszam) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }
        
        // Email formátum ellenőrzése
        if (!data.email.includes('@') || !data.email.includes('.')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }

        // Email duplikáció ellenőrzése
        const osszesUser = await this.userRepository.getUser();
        const letezoEmail = osszesUser.find(u => u.email.toLowerCase() === data.email.toLowerCase());
        if (letezoEmail) {
            throw new BadRequestError("Ez az email cím már regisztrálva van");
        }

        // Név nem lehet üres
        if (!data.vezeteknev.trim() || !data.keresztnev.trim()) {
            throw new BadRequestError("A név mezők nem lehetnek üresek");
        }

        return await this.userRepository.createUser(data);
    }

    async updateUser(id, data){
        if (data.email && !data.email.includes('@')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }
        
        return await this.userRepository.updateUser(id, data);
    }

    async deleteUser(id){
        return await this.userRepository.deleteUser(id);
    }
}

module.exports = UserService;

