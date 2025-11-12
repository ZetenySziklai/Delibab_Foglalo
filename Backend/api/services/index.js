const UserService = require("./UserService");
const AsztalService = require("./AsztalService");
const FoglalasService = require("./FoglalasService");
const AllergenService = require("./AllergenService");
const AllergeninfoService = require("./AllergeninfoService");
const MegjegyzesService = require("./MegjegyzesService");
const AsztalAllapotService = require("./AsztalAllapotService");
const EtkezesTipusaService = require("./EtkezesTipusaService");

module.exports = (db) => {
    const userService = new UserService(db);
    const asztalService = new AsztalService(db);
    const foglalasService = new FoglalasService(db);
    const allergenService = new AllergenService(db);
    const allergeninfoService = new AllergeninfoService(db);
    const megjegyzesService = new MegjegyzesService(db);
    const asztalAllapotService = new AsztalAllapotService(db);
    const etkezesTipusaService = new EtkezesTipusaService(db);

    return {
        userService,
        asztalService,
        foglalasService,
        allergenService,
        allergeninfoService,
        megjegyzesService,
        asztalAllapotService,
        etkezesTipusaService
    };
}


