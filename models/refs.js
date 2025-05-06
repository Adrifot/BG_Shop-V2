const Boardgame = require("./boardgame");
const Designer = require("./designer");
const Publisher = require("./publisher");
const Tag = require("./tag");
const User = require("./user");
const Review = require("./review");
const BoardgameTag = require("./boardgame_tags");

Boardgame.belongsTo(Designer, { foreignKey: "designerId" });
Boardgame.belongsTo(Publisher, { foreignKey: "publisherId" });
Boardgame.hasMany(Review, { foreignKey: "boardgameId" });
Boardgame.belongsToMany(Tag, {
  through: BoardgameTag,
  foreignKey: "boardgame_id",
  as: "tags"
});

Designer.hasMany(Boardgame, { foreignKey: "designerId" });

Publisher.hasMany(Boardgame, { foreignKey: "publisherId" });

Tag.belongsToMany(Boardgame, {
  through: BoardgameTag,
  foreignKey: "tagId",
  as: "boardgames"
});

User.hasMany(Review, { foreignKey: "userId" });

Review.belongsTo(User, { foreignKey: "userId" });
Review.belongsTo(Boardgame, { foreignKey: "boardgameId" });

