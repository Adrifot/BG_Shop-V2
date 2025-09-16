const sequelize = require("../config/database");

const BoardgameCreator = sequelize.define(
    "boardgame_creator",
    {},
    {
        tableName: "boardgame_creators"
    }
);

module.exports = BoardgameCreator;