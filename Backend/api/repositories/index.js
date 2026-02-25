const FelhasznaloRepository = require("./FelhasznaloRepository");
const AsztalRepository = require("./AsztalRepository");
const FoglalasRepository = require("./FoglalasRepository");
const FoglalasiAdatokRepository = require("./FoglalasiAdatokRepository");
const IdopontRepository = require("./IdopontRepository");

module.exports = (db) =>{
    const userRepository = new FelhasznaloRepository(db);
    const asztalRepository = new AsztalRepository(db);
    const foglalasRepository = new FoglalasRepository(db);
    const foglalasiAdatokRepository = new FoglalasiAdatokRepository(db);
    const idopontRepository = new IdopontRepository(db);

    return {
        userRepository,
        asztalRepository,
        foglalasRepository,
        foglalasiAdatokRepository,
        idopontRepository
    };
}