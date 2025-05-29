const Boardgame = require("./boardgame");
const Designer = require("./designer");
const Publisher = require("./publisher");
const Tag = require("./tag");
const User = require("./user");
const Review = require("./review");
const BoardgameTag = require("./boardgame_tags");

Boardgame.belongsTo(Designer, { foreignKey: { name: "designerId" } });
Boardgame.belongsTo(Publisher, { foreignKey: { name: "publisherId" } });
Boardgame.hasMany(Review, { foreignKey: { name: "boardgameId", allowNull: false } });
Boardgame.belongsToMany(Tag, {
  through: BoardgameTag,
  foreignKey: { name: "boardgame_id", allowNull: false },
  as: "tags"
});

Designer.hasMany(Boardgame, { foreignKey: { name: "designerId" } });

Publisher.hasMany(Boardgame, { foreignKey: { name: "publisherId" } });

Tag.belongsToMany(Boardgame, {
  through: BoardgameTag,
  foreignKey: { name: "tagId", allowNull: false },
  as: "boardgames"
});

User.hasMany(Review, { foreignKey: { name: "userId", allowNull: false } });

Review.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
Review.belongsTo(Boardgame, { foreignKey: { name: "boardgameId", allowNull: false } });

