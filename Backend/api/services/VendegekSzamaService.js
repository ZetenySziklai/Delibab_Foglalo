class VendegekSzamaService {
    constructor(db){
        this.vendegekszamaRepository = require("../repositories")(db).vendegekszamaRepository;
    }
    
    async getVendegekSzama(){
        return await this.vendegekszamaRepository.getVendegekSzama();
    }

    async getVendegekSzamaById(id){
        if (!id || isNaN(id)) {
            throw new Error("Érvényes ID-t adjon meg");
        }
        return await this.vendegekszamaRepository.getVendegekSzamaById(id);
    }

    async getVendegekSzamaByTotal(total){
        if (!total || isNaN(total) || total < 1) {
            throw new Error("Érvényes vendégszámot adjon meg (minimum 1)");
        }
        return await this.vendegekszamaRepository.getVendegekSzamaByTotal(total);
    }

    async getVendegekSzamaByChildrenCount(gyerekCount){
        if (gyerekCount < 0 || isNaN(gyerekCount)) {
            throw new Error("Érvényes gyerek számot adjon meg (minimum 0)");
        }
        return await this.vendegekszamaRepository.getVendegekSzamaByChildrenCount(gyerekCount);
    }

    async createVendegekSzama(data){
        if (!data.felnott || !data.gyerek) {
            throw new Error("Felnőtt és gyerek szám megadása kötelező");
        }
        
        if (data.felnott < 0 || data.gyerek < 0 || isNaN(data.felnott) || isNaN(data.gyerek)) {
            throw new Error("Érvényes számokat adjon meg (minimum 0)");
        }
        
        if (data.felnott === 0 && data.gyerek === 0) {
            throw new Error("Legalább egy vendégnek kell lennie");
        }

        return await this.vendegekszamaRepository.createVendegekSzama(data);
    }

    async updateVendegekSzama(id, data){
        if (!id || isNaN(id)) {
            throw new Error("Érvényes ID-t adjon meg");
        }
        
        if (data.felnott !== undefined && (data.felnott < 0 || isNaN(data.felnott))) {
            throw new Error("Érvényes felnőtt számot adjon meg");
        }
        
        if (data.gyerek !== undefined && (data.gyerek < 0 || isNaN(data.gyerek))) {
            throw new Error("Érvényes gyerek számot adjon meg");
        }

        return await this.vendegekszamaRepository.updateVendegekSzama(id, data);
    }
}

module.exports = VendegekSzamaService;
