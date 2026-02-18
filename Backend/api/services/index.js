const UserService = require("./FelhasznaloService");
const AsztalService = require("./AsztalService");
const FoglalasService = require("./FoglalasService");
const FoglalasiAdatokService = require("./FoglalasiAdatokService");
const IdopontService = require("./IdopontService");

module.exports = (db) => {
    const userService = new UserService(db);
    const asztalService = new AsztalService(db);
    const foglalasService = new FoglalasService(db);
    const foglalasiAdatokService = new FoglalasiAdatokService(db);
    const idopontService = new IdopontService(db);

    return {
        userService,
        asztalService,
        foglalasService,
        foglalasiAdatokService,
        idopontService
    };
}


