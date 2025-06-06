const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Tag = sequelize.define(
    "tag", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        tagname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }
);

module.exports = Tag;