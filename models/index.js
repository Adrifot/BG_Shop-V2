const Boardgame = require("./boardgame");
const Creator = require("./creator");
const Tag = require("./tag");
const User = require("./user");
const Review = require("./review");
const BoardgameTag = require("./boardgame_tags");
const BoardgameCreator = require("./boardgame_creators");

require("./refs");

module.exports = {
  Boardgame,
  Creator,
  Tag,
  User,
  Review,
  BoardgameTag,
  BoardgameCreator
};
