const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bgshopv2", "bgshop_admin", "pZeb#rul24l", {
    host: "localhost",
    dialect: "postgres",
});

module.exports = sequelize;