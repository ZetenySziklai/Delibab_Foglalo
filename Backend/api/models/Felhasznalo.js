const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Felhasznalo extends Model {};

    Felhasznalo.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            vezeteknev: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            keresztnev: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            telefonszam: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            regisztracio_datuma: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            jelszo: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Felhasznalo",
            tableName: "felhasznalo",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Felhasznalo;
}
