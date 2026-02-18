const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class FoglalasiAdatok extends Model {};

    FoglalasiAdatok.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            foglalas_datum: {
                type: DataTypes.DATE,
                allowNull: false
            },
            megjegyzes: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            felnott: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            gyerek: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: "FoglalasiAdatok",
            tableName: "foglalasiAdatok",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return FoglalasiAdatok;
}