const Boardgame = require("./models/boardgame");
const Designer = require("./models/designer");
const Publisher = require("./models/publisher");
const Tag = require("./models/tag");
const User = require("./models/user");
const Review = require("./models/review");
const BoardgameTag = require("./models/boardgame_tags");

Boardgame.belongsTo(Designer, { foreignKey: "designerId" });
Boardgame.belongsTo(Publisher, { foreignKey: "publisherId" });
Boardgame.hasMany(Review, { foreignKey: "boardgameId" });
Boardgame.belongsToMany(Tag, {
  through: BoardgameTag,
  foreignKey: "boardgame_id"
});

Designer.hasMany(Boardgame, { foreignKey: "designerId" });

Publisher.hasMany(Boardgame, { foreignKey: "publisherId" });

Tag.belongsToMany(Boardgame, {
  through: BoardgameTag,
  foreignKey: "tag_id"
});

User.hasMany(Review, { foreignKey: "userId" });

Review.belongsTo(User, { foreignKey: "userId" });
Review.belongsTo(Boardgame, { foreignKey: "boardgameId" });

