const IdopontRepository = require("./IdopontRepository");
const FoglaloRepository = require("./FoglaloRepository");
const VendegekSzamaRepository = require("./VendegekSzamaRepository")
const EtkezesTipusaRepository = require("./EtkezesTipusaRepository")


module.exports = (db) =>{
    const idopontRepository = new IdopontRepository(db);
    const foglaloRepository = new FoglaloRepository(db);
    const vendegekSzamaRepository = new VendegekSzamaRepository(db);
    const etkezestipusaRepository = new EtkezesTipusaRepository(db);



    return {
        idopontRepository,
        foglaloRepository, 
        vendegekSzamaRepository, 
        etkezestipusaRepository,
    };
}