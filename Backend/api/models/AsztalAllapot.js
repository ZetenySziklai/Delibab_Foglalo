const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class AsztalAllapot extends Model {};

    AsztalAllapot.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nev: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "AsztalAllapot",
            tableName: "asztal_allapot",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return AsztalAllapot;
}




