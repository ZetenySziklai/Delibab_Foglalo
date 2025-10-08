const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Idopont extends Model {};

    Idopont.init(
        {
            idopont_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            foglalas_nap_ido: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Idopont",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return Idopont;
}