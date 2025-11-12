const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Allergeninfo extends Model {};

    Allergeninfo.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            allergen_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            foglalas_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Allergeninfo",
            tableName: "allergeninfo",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Allergeninfo;
}




