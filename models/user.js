const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10

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
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.pswdhash) user.pswdhash = await bcrypt.hash(user.pswdhash, SALT_ROUNDS);
            },
            beforeUpdate: async (user) => {
                if (user.changed("pswdhash")) user.pswdhash = await bcrypt.hash(user.pswdhash, SALT_ROUNDS);
            }
        }
    }
);

User.prototype.validatePassword = function(password) {
    return bcrypt.compare(password, this.pswdhash);
}

module.exports = User;