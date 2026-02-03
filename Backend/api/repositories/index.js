const UserRepository = require("./UserRepository");
const AsztalRepository = require("./AsztalRepository");
const FoglalasRepository = require("./FoglalasRepository");
const AsztalAllapotRepository = require("./AsztalAllapotRepository");
const EtkezesTipusaRepository = require("./EtkezesTipusaRepository");

module.exports = (db) =>{
    const userRepository = new UserRepository(db);
    const asztalRepository = new AsztalRepository(db);
    const foglalasRepository = new FoglalasRepository(db);
    const asztalAllapotRepository = new AsztalAllapotRepository(db);
    const etkezesTipusaRepository = new EtkezesTipusaRepository(db);

    return {
        userRepository,
        asztalRepository,
        foglalasRepository,
        asztalAllapotRepository,
        etkezesTipusaRepository
    };
}