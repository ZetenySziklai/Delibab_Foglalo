const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Allergen extends Model {};

    Allergen.init(
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
            modelName: "Allergen",
            tableName: "allergen",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Allergen;
}




