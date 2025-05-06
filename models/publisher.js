const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Publisher = sequelize.define(
    "publisher", 
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
        }
    }
);

module.exports = Publisher;