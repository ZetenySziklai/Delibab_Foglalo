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
            foglalas_datum: {
                type: DataTypes.DATE,
                allowNull: false
            },
            megjegyzes: {
                type: DataTypes.INTEGER,
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
            // user_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false
            // },
            // asztal_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false
            // },
            
            // etkezes_id: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false
            // },
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