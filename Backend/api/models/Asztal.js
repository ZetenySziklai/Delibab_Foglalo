const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Asztal extends Model {};

    Asztal.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            helyek_szama: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: "Asztal",
            tableName: "asztal",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Asztal;
}
