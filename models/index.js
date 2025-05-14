const Boardgame = require("./boardgame");
const Designer = require("./designer");
const Publisher = require("./publisher");
const Tag = require("./tag");
const User = require("./user");
const Review = require("./review");
const BoardgameTag = require("./boardgame_tags");

require("./refs");

module.exports = {
  Boardgame,
  Designer,
  Publisher,
  Tag,
  User,
  Review,
  BoardgameTag
};
