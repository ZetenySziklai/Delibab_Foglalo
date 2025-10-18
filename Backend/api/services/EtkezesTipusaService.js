class EtkezesTipusaService {
    constructor(db){
        this.etkezestipusaRepository = require("../repositories")(db).etkezestipusaRepository;
    }
    
    async getEtkezesTipusa(){
        return await this.etkezestipusaRepository.getEtkezesTipusa();
    }

    async getEtkezesTipusaById(id){
        if (!id || isNaN(id)) {
            throw new Error("Érvényes ID-t adjon meg");
        }
        return await this.etkezestipusaRepository.getEtkezesTipusaById(id);
    }

    async getEtkezesTipusaByType(type){
        const validTypes = ['reggeli', 'ebed', 'vacsora'];
        if (!validTypes.includes(type)) {
            throw new Error("Érvényes étkezés típust adjon meg: reggeli, ebed, vacsora");
        }
        return await this.etkezestipusaRepository.getEtkezesTipusaByType(type);
    }

    async getEtkezesTipusaByMealCount(count){
        if (count < 0 || count > 3 || isNaN(count)) {
            throw new Error("Érvényes étkezés számot adjon meg (0-3 között)");
        }
        return await this.etkezestipusaRepository.getEtkezesTipusaByMealCount(count);
    }
    
    async createEtkezesTipusa(data){
        if (!data.reggeli && !data.ebed && !data.vacsora) {
            throw new Error("Legalább egy étkezés típust ki kell választani");
        }
        
        if (data.reggeli !== 0 && data.reggeli !== 1 && data.reggeli !== undefined) {
            throw new Error("Reggeli értéke 0 vagy 1 lehet");
        }
        
        if (data.ebed !== 0 && data.ebed !== 1 && data.ebed !== undefined) {
            throw new Error("Ebéd értéke 0 vagy 1 lehet");
        }
        
        if (data.vacsora !== 0 && data.vacsora !== 1 && data.vacsora !== undefined) {
            throw new Error("Vacsora értéke 0 vagy 1 lehet");
        }

        return await this.etkezestipusaRepository.createEtkezesTipusa(data);
    }

    async updateEtkezesTipusa(id, data){
        if (!id || isNaN(id)) {
            throw new Error("Érvényes ID-t adjon meg");
        }
        
        if (data.reggeli !== undefined && data.reggeli !== 0 && data.reggeli !== 1) {
            throw new Error("Reggeli értéke 0 vagy 1 lehet");
        }
        
        if (data.ebed !== undefined && data.ebed !== 0 && data.ebed !== 1) {
            throw new Error("Ebéd értéke 0 vagy 1 lehet");
        }
        
        if (data.vacsora !== undefined && data.vacsora !== 0 && data.vacsora !== 1) {
            throw new Error("Vacsora értéke 0 vagy 1 lehet");
        }

        return await this.etkezestipusaRepository.updateEtkezesTipusa(id, data);
    }
}

module.exports = EtkezesTipusaService;