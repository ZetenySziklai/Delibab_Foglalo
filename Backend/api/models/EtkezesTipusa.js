const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class EtkezesTipusa extends Model {};

    EtkezesTipusa.init(
        {
            reggeli: {
                type: DataTypes.TINYINT,
                allowNull: false
            },
            ebed: {
                type: DataTypes.TINYINT,
                allowNull: false
            },
            vacsora: {
                type: DataTypes.TINYINT,
                allowNull: false
            },
            etkezes_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "EtkezesTipusa",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return EtkezesTipusa;
}