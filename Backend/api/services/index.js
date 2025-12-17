const UserService = require("./UserService");
const AsztalService = require("./AsztalService");
const FoglalasService = require("./FoglalasService");
const FoglaloService = require("./FoglaloService");
const AllergenService = require("./AllergenService");
const AllergeninfoService = require("./AllergeninfoService");
const MegjegyzesService = require("./MegjegyzesService");
const AsztalAllapotService = require("./AsztalAllapotService");
const EtkezesTipusaService = require("./EtkezesTipusaService");
const IdopontService = require("./IdopontService");

module.exports = (db) => {
    const userService = new UserService(db);
    const asztalService = new AsztalService(db);
    const foglalasService = new FoglalasService(db);
    const foglaloService = new FoglaloService(db);
    const allergenService = new AllergenService(db);
    const allergeninfoService = new AllergeninfoService(db);
    const megjegyzesService = new MegjegyzesService(db);
    const asztalAllapotService = new AsztalAllapotService(db);
    const etkezesTipusaService = new EtkezesTipusaService(db);
    const idopontService = new IdopontService(db);

    return {
        userService,
        asztalService,
        foglalasService,
        foglaloService,
        allergenService,
        allergeninfoService,
        megjegyzesService,
        asztalAllapotService,
        etkezesTipusaService,
        idopontService
    };
}


