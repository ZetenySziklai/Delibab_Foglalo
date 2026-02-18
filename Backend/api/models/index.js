const Felhasznalo = require("./Felhasznalo");
const FoglalasiAdatok = require("./FoglalasiAdatok");
const Idopont = require("./Idopont");

module.exports = (sequelize) => {
    const Asztal = require("./Asztal")(sequelize);
    const Felhasznalo = require("./Felhasznalo")(sequelize);
    const Foglalas = require("./Foglalas")(sequelize);
    const FoglalasiAdatok = require("./FoglalasiAdatok")(sequelize);
    const Idopont = require("./Idopont")(sequelize);


    Felhasznalo.hasMany(Foglalas);
    Foglalas.belongsTo(Felhasznalo);

    Asztal.hasMany(Foglalas);
    Foglalas.belongsTo(Asztal);

    Idopont.hasOne(Foglalas);
    Foglalas.belongsTo(Idopont);

    Foglalas.hasOne(Foglalas)
    FoglalasiAdatok.belongsTo(Foglalas)

    return {
        Asztal,
        Felhasznalo,
        Foglalas,
        FoglalasiAdatok,
        Idopont
    };
}

