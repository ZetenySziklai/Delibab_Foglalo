const UserRepository = require("./UserRepository");
const AsztalRepository = require("./AsztalRepository");
const FoglalasRepository = require("./FoglalasRepository");
const AllergenRepository = require("./AllergenRepository");
const AllergeninfoRepository = require("./AllergeninfoRepository");
const MegjegyzesRepository = require("./MegjegyzesRepository");
const AsztalAllapotRepository = require("./AsztalAllapotRepository");
const EtkezesTipusaRepository = require("./EtkezesTipusaRepository");

module.exports = (db) =>{
    const userRepository = new UserRepository(db);
    const asztalRepository = new AsztalRepository(db);
    const foglalasRepository = new FoglalasRepository(db);
    const allergenRepository = new AllergenRepository(db);
    const allergeninfoRepository = new AllergeninfoRepository(db);
    const megjegyzesRepository = new MegjegyzesRepository(db);
    const asztalAllapotRepository = new AsztalAllapotRepository(db);
    const etkezesTipusaRepository = new EtkezesTipusaRepository(db);

    return {
        userRepository,
        asztalRepository,
        foglalasRepository,
        allergenRepository,
        allergeninfoRepository,
        megjegyzesRepository,
        asztalAllapotRepository,
        etkezesTipusaRepository
    };
}