

module.exports = (sequelize) => {
    const Asztal = require("./Asztal")(sequelize);
    const Felhasznalo = require("./Felhasznalo")(sequelize);
    const Foglalas = require("./Foglalas")(sequelize);
    const FoglalasiAdatok = require("./FoglalasiAdatok")(sequelize);
    const Idopont = require("./Idopont")(sequelize);


    Felhasznalo.hasMany(Foglalas, { foreignKey: 'user_id' });
    Foglalas.belongsTo(Felhasznalo, { foreignKey: 'user_id' });

    Asztal.hasMany(Foglalas, { foreignKey: 'asztal_id' });
    Foglalas.belongsTo(Asztal, { foreignKey: 'asztal_id' });

    Idopont.hasOne(Foglalas);
    Foglalas.belongsTo(Idopont);

    Foglalas.hasOne(FoglalasiAdatok)
    FoglalasiAdatok.belongsTo(Foglalas)

    return {
        Asztal,
        Felhasznalo,
        Foglalas,
        FoglalasiAdatok,
        Idopont
    };
}

