module.exports = (sequelize) => {
    const User = require("./User")(sequelize);
    const Asztal = require("./Asztal")(sequelize);
    const AsztalAllapot = require("./AsztalAllapot")(sequelize);
    const Foglalas = require("./Foglalas")(sequelize);
    const EtkezesTipusa = require("./EtkezesTipusa")(sequelize);

    // User N-<>-M Asztal = Foglalas tábla
    User.belongsToMany(Asztal, {
        foreignKey: "user_id",
        through: Foglalas
    });

    Asztal.belongsToMany(User, {
        foreignKey: "asztal_id",
        through: Foglalas
    });

    Foglalas.belongsTo(User, { foreignKey: "user_id" });
    Foglalas.belongsTo(Asztal, { foreignKey: "asztal_id" });

    User.hasMany(Foglalas, { foreignKey: "user_id" });
    Asztal.hasMany(Foglalas, { foreignKey: "asztal_id" });

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

    

    return {
        User,
        Asztal,
        AsztalAllapot,
        Foglalas,
        EtkezesTipusa
    };
}

