const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Foglalas extends Model {};

    Foglalas.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            foglalas_datum: {
                type: DataTypes.DATE,
                allowNull: false
            },
            megjegyzes: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            felnott: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            gyerek: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            // user_id, asztal_id, etkezes_id - az index.js asszociációk adják hozzá
        },
        {
            sequelize,
            modelName: "Foglalas",
            tableName: "foglalas",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Foglalas;
}