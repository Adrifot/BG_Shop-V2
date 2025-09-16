const Boardgame = require("./boardgame");
const Creator = require("./creator");
const Tag = require("./tag");
const User = require("./user");
const Review = require("./review");
const BoardgameTag = require("./boardgame_tags");
const BoardgameCreator = require("./boardgame_creators");

Boardgame.hasMany(Review, { foreignKey: { name: "boardgameId", allowNull: false } });
Boardgame.belongsToMany(Tag, {
  through: BoardgameTag,
  foreignKey: { name: "boardgameId", allowNull: false },
  as: "tags"
});
Boardgame.belongsToMany(Creator, {
  through: BoardgameCreator,
  foreignKey: {name: "boardgameId", allowNull: false},
  as: "creators"
});

Tag.belongsToMany(Boardgame, {
  through: BoardgameTag,
  foreignKey: { name: "tagId", allowNull: false },
  as: "boardgames"
});

Creator.belongsToMany(Boardgame, {
  through: BoardgameCreator,
  foreignKey: {name: "creatorId", allowNull: false},
  as: "boardgames"
})

User.hasMany(Review, { foreignKey: { name: "userId", allowNull: false } });

Review.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
Review.belongsTo(Boardgame, { foreignKey: { name: "boardgameId", allowNull: false } });

