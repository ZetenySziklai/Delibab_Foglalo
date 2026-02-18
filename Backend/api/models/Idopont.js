const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Idopont extends Model {};

    Idopont.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            kezdet: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            veg:{
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Idopont",
            tableName: "idopont",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Idopont;
}