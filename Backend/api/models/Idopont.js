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
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            veg:{
                type: DataTypes.DOUBLE,
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