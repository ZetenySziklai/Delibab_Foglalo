const UserService = require("./UserService");
const AsztalService = require("./AsztalService");
const FoglalasService = require("./FoglalasService");
const AsztalAllapotService = require("./AsztalAllapotService");
const EtkezesTipusaService = require("./EtkezesTipusaService");

module.exports = (db) => {
    const userService = new UserService(db);
    const asztalService = new AsztalService(db);
    const foglalasService = new FoglalasService(db);
    const asztalAllapotService = new AsztalAllapotService(db);
    const etkezesTipusaService = new EtkezesTipusaService(db);

    return {
        userService,
        asztalService,
        foglalasService,
        asztalAllapotService,
        etkezesTipusaService
    };
}


