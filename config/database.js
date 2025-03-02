const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bgshop_v2', 'bgshop_admin', 'bgshop_admin_pswd', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  });

  module.exports = sequelize;