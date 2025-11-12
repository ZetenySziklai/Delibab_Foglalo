const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Megjegyzes extends Model {};

    Megjegyzes.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            szoveg: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: "Megjegyzes",
            tableName: "megjegyzes",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Megjegyzes;
}




