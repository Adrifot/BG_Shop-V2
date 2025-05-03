const {DataTypes} = require("sequelize");
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
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
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
            allowNull: false,
            defaultValue: "Uncategorized"
        },

        imagesrc: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },

        minPlayers: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },

        maxPlayers: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                checkMaxPlayers(value) {
                    if (value != null  && value < this.min_players)
                        throw new Error("max_players should be greater than or equal to min_players!")
                }
            }
        },

        minPlaytime: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            }
        },

        maxPlaytime: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                checkMaxPlaytime(value) {
                    if (this.min_playtime !== null && value !== null && value <= this.min_playtime) 
                        throw new Error("max_playtime must be greater than min_playtime");
                }
            }
        },

        age: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        releaseYear: {
            type: DataTypes.INTEGER
        },

        isExpansion: {
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