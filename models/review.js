const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define(
    "review",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        body: {
            type: DataTypes.TEXT
        },

        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            } 
        }
    },
    {
        timestamps: true
    }
);

module.exports = Review;