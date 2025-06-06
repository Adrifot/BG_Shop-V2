const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
    "user", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: [3, 18]
            }
        },

        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },

        pswdhash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        profilepic: {
            type: DataTypes.STRING
        },

        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
            allowNull: false
        },

        lastLogin: {
            type: DataTypes.DATE
        }
    },
    {
        timestamps: true
    }
);

module.exports = User;