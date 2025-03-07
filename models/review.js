const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Boardgame = require("./boardgame");

const Review = sequelize.define(
    "review",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        body: {
            type: DataTypes.STRING
        },

        rating: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 5
            },
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

Boardgame.hasMany(Review);
Review.belongsTo(Boardgame);
module.exports = Review;