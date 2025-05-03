const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Designer = sequelize.define(
    "designer", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        country: {
            type: DataTypes.STRING
        },
    }
);

module.exports = Designer;