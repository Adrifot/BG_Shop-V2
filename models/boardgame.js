const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Boardgame = sequelize.define(
    "boardgame",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0.01,
                isFloat: {
                    msg: "Price must be a valid number"
                }
            }
        },

        category: {
            type: DataTypes.ENUM("Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"),
            allowNull: false
        },

        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },

        imagesrc: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },

        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 5
            }
        },

        minplayers: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },

        maxplayers: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1
            }
        },

        playtime: {
            type: DataTypes.INTEGER
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        designer: {
            type: DataTypes.STRING
        },

        publisher: {
            type: DataTypes.STRING
        },

        releaseyear: {
            type: DataTypes.INTEGER
        },

        isavailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },

        isexpansion: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = Boardgame;