const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Creator = sequelize.define(
    "creator", 
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

        website: {
            type: DataTypes.STRING
        },

        type: {
            type: DataTypes.ENUM("designer", "publisher", "both"),
            allowNull: false
        }
    }
);

module.exports = Creator;