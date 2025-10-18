const IdopontService = require("./IdopontService");
const FoglaloService = require("./FoglaloService");
const VendegekSzamaService = require("./VendegekSzamaService")
const EtkezesTipusaService = require("./EtkezesTipusaService")



module.exports = (db) => {
    const idopontService = new IdopontService(db);
    const foglaloService = new FoglaloService(db);
    const vendegekszamaService = new VendegekSzamaService(db);
    const etkezestipusaService = new EtkezesTipusaService(db);

    return {
        idopontService,
        foglaloService,
        vendegekszamaService, 
        etkezestipusaService,
    };
}


