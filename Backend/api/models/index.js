module.exports = (sequelize) => {
    const User = require("./User")(sequelize);
    const Asztal = require("./Asztal")(sequelize);
    const AsztalAllapot = require("./AsztalAllapot")(sequelize);
    const Foglalas = require("./Foglalas")(sequelize);
    const EtkezesTipusa = require("./EtkezesTipusa")(sequelize);
    const Megjegyzes = require("./Megjegyzes")(sequelize);
    const Allergen = require("./Allergen")(sequelize);
    const Allergeninfo = require("./Allergeninfo")(sequelize);
    const Foglalo = require("./Foglalo")(sequelize);
    const Idopont = require("./Idopont")(sequelize);
    const VendegekSzama = require("./VendegekSzama")(sequelize);

    // User N-<>-M Asztal = Foglalas tábla
    User.hasMany(Foglalas, {
        foreignKey: "user_id"
    });
    Foglalas.belongsTo(User, {
        foreignKey: "user_id"
    });

    Asztal.hasMany(Foglalas, {
        foreignKey: "asztal_id",
    });
    Foglalas.belongsTo(Asztal, {
        foreignKey: "asztal_id"
    });

    // Asztal 1-<>-1 asztal_allapot
    AsztalAllapot.hasMany(Asztal, {
        foreignKey: "asztal_allapot_id"
    });
    Asztal.belongsTo(AsztalAllapot, {
        foreignKey: "asztal_allapot_id"
    });

    // Foglalas 1-<>-1 etkezes_tipusa
    EtkezesTipusa.hasMany(Foglalas, {
        foreignKey: "etkezes_id"
    });
    Foglalas.belongsTo(EtkezesTipusa, {
        foreignKey: "etkezes_id"
    });

    // Foglalas N-<>-1 Megjegyzes
    Megjegyzes.hasMany(Foglalas, {
        foreignKey: "megjegyzes_id"
    });
    Foglalas.belongsTo(Megjegyzes, {
        foreignKey: "megjegyzes_id"
    });

    // Allergeninfo (több a többhöz)
    Allergen.hasMany(Allergeninfo, {
        foreignKey: "allergen_id"
    });
    Allergeninfo.belongsTo(Allergen, {
        foreignKey: "allergen_id"
    });

    Foglalas.hasMany(Allergeninfo, {
        foreignKey: "foglalas_id"
    });
    Allergeninfo.belongsTo(Foglalas, {
        foreignKey: "foglalas_id"
    });

    // Foglalo kapcsolatok
    Idopont.hasMany(Foglalo, {
        foreignKey: "idopont_id",
        as: "Foglalos"
    });
    Foglalo.belongsTo(Idopont, {
        foreignKey: "idopont_id"
    });

    VendegekSzama.hasMany(Foglalo, {
        foreignKey: "vendeg_id",
        as: "Foglalos"
    });
    Foglalo.belongsTo(VendegekSzama, {
        foreignKey: "vendeg_id"
    });

    return {
        User,
        Asztal,
        AsztalAllapot,
        Foglalas,
        EtkezesTipusa,
        Megjegyzes,
        Allergen,
        Allergeninfo,
        Foglalo,
        Idopont,
        VendegekSzama
    };
}

