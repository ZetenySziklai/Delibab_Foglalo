const Foglalo = require("./Foglalo");
const Idopont = require("./Idopont");
const VendegekSzama = require("./VendegekSzama");
const EtkezesTipusa = require("./EtkezesTipusa");


module.exports = (sequelize ) => {
    const Idopont = require("./Idopont")(sequelize);
    const Foglalo = require("./Foglalo")(sequelize);
    const VendegekSzama= require("./VendegekSzama")(sequelize);
    const EtkezesTipusa= require("./EtkezesTipusa")(sequelize);

    Idopont.hasMany(Foglalo, {
        foreignKey: "idopont_id"
    })
    Foglalo.belongsTo(Idopont, {
        foreignKey: "idopont_id"
    })


    VendegekSzama.hasMany(Foglalo,{
        foreignKey: "vendeg_id"
    })
    Foglalo.belongsTo(VendegekSzama,{
        foreignKey: "vendeg_id"
    })


    EtkezesTipusa.hasMany(Foglalo,{
        foreignKey: "etkezes_id"
    })
    Foglalo.belongsTo(EtkezesTipusa,{
        foreignKey: "etkezes_id"
    })


    return {
    Idopont,
    Foglalo,
    VendegekSzama,
    EtkezesTipusa,
    };
}

