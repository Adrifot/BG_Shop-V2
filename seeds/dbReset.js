const sequelize = require("../config/database");

const seedDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Sequelize connected.");
        await sequelize.sync({ force: true });
    } catch(err) {
        console.error("Error dropping all tables in database: ", err);
    } finally {
        await sequelize.close();
        console.log("DB connection closed.");
    }
}

console.log("Dropping process initialized...");
seedDB();

