const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class VendegekSzama extends Model {};

    VendegekSzama.init(
        {
            felnott: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            gyerek: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            vendeg_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "VendegekSzama",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return VendegekSzama;
}