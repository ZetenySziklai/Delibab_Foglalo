const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class User extends Model {};

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            vezeteknev: {
                type: DataTypes.STRING,
                allowNull: false
            },
            keresztnev: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            telefonszam: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            regisztracio_datuma: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
        }
    );
    return User;
}
