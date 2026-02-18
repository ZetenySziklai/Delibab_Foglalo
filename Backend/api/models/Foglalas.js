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
            }
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