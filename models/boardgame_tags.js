const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const BoardgameTag = sequelize.define(
    "boardgame_tag",
    {},
    {
        tableName: "bordgame_tags"
    }
);

module.exports = BoardgameTag;