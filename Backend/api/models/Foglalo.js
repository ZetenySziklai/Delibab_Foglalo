const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Foglalo extends Model {};

    Foglalo.init(
        {
            vezeteknev: {
                type: DataTypes.STRING,
                allowNull: false
            },
            keresztnev: {
                type: DataTypes.STRING,
                allowNull: false
            },
            telefonszam: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            megjegyzes: {
                type: DataTypes.STRING,
                allowNull: false
            },
            foglalo_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },          
        },
        {
            sequelize,
            modelName: "Foglalo",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Foglalo;
}