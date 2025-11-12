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
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            asztal_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            foglalas_datum: {
                type: DataTypes.DATE,
                allowNull: false
            },
            etkezes_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            megjegyzes_id: {
                type: DataTypes.INTEGER,
                allowNull: true
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