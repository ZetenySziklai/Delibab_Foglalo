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
                allowNull: false,
                references: { model: 'felhasznalo', key: 'id' }
            },
            asztal_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'asztal', key: 'id' }
            },
            foglalas_datum: {
                type: DataTypes.DATE,
                allowNull: false
            },
            IdopontId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: 'idopont', key: 'id' }
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