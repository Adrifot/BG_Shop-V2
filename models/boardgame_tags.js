const sequelize = require("../config/database");

const BoardgameTag = sequelize.define(
    "boardgame_tag",
    {},
    {
        tableName: "boardgame_tags"
    }
);

module.exports = BoardgameTag;