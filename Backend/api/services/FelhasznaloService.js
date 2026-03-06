const { BadRequestError } = require("../errors");

class UserService {
    constructor(db) {
        this.userRepository = require("../repositories")(db).userRepository;
    }

    async getUser(options = {}) {
        return await this.userRepository.getUser(options);
    }

    async getUserById(id, options = {}) {
        return await this.userRepository.getUserById(id, options);
    }

    async createUser(data, options = {}) {
        if (!data || !data.vezeteknev || !data.keresztnev || !data.email || !data.telefonszam || !data.jelszo) {
            throw new BadRequestError("Minden kötelező mezőt ki kell tölteni");
        }

        const nameRegex = /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+$/;
        if (!nameRegex.test(data.vezeteknev) || !nameRegex.test(data.keresztnev)) {
            throw new BadRequestError("A név csak betűket tartalmazhat");
        }

        if (!data.email.includes('@')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }

        const phoneNormalized = String(data.telefonszam).replace(/[\s-]/g, "");
        if (!/^\+?\d{7,15}$/.test(phoneNormalized)) {
            throw new BadRequestError("A telefonszám csak szám lehet (7-15 számjegy)");
        }

        const existingByEmail = await this.userRepository.getUserByEmail(data.email, options);
        const existingByPhone = await this.userRepository.getUserByPhone(phoneNormalized, options);
        if (existingByEmail?.length > 0 || existingByPhone?.length > 0) {
            throw new BadRequestError("Ezzel az emaillel vagy telefonszámmal már van felhasználó");
        }

        data.telefonszam = phoneNormalized;
        return await this.userRepository.createUser(data, options);
    }

    async updateUser(id, data, options = {}) {
        if (data.email) {
            const existing = await this.userRepository.getUserByEmail(data.email, options);
            if (existing?.length > 0 && existing[0].id !== parseInt(id)) {
                throw new BadRequestError("Ez az email cím már használatban van");
            }
        }

        const nameRegex = /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+$/;
        if ((data.vezeteknev && !nameRegex.test(data.vezeteknev)) ||
            (data.keresztnev && !nameRegex.test(data.keresztnev))) {
            throw new BadRequestError("A név csak betűket tartalmazhat");
        }

        return await this.userRepository.updateUser(id, data, options);
    }

    async deleteUser(id, options = {}) {
        return await this.userRepository.deleteUser(id, options);
    }

    async getUserByEmail(email, options = {}) {
        if (!email || !email.includes('@')) {
            throw new BadRequestError("Érvényes email címet adjon meg");
        }
        return await this.userRepository.getUserByEmail(email, options);
    }

    async getUserWithDetails(options = {}) {
        return await this.userRepository.getUserWithDetails(options);
    }

    async getUserCountByEmail(options = {}) {
        return await this.userRepository.getUserCountByEmail(options);
    }

    async getTopUsers(limit, options = {}) {
        return await this.userRepository.getTopUsers(limit, options);
    }

    async getUsersByDateRange(startDate, endDate, options = {}) {
        if (!startDate || !endDate) {
            throw new BadRequestError("Kezdő és végdátum megadása kötelező");
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
            throw new BadRequestError("Érvényes dátumokat adjon meg");
        }

        return await this.userRepository.getUsersByDateRange(startDate, endDate, options);
    }

    async getUsersByEtkezesType(options = {}) {
        return await this.userRepository.getUsersByEtkezesType(options);
    }
}

module.exports = UserService;