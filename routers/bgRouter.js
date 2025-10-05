const express = require("express");
const router = express.Router();

const asyncHandler = require("../middleware/asyncHandler");
const needLogin = require("../middleware/loginCheck");
const ExpressError = require("../errors/expressError");

const {Boardgame, Review, Creator} = require("../models");

const BGCategories = ["Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"];

const bgIncludeArr = [
    {model: Creator, as: "creators", attributes: ["name", "id", "type"]},
    {association: "tags", attributes: ["tagname", "id"]},
];

const reviewModelObj = {model: Review, include: {association: "user", attributes: ["id", "username", "profilepic"]}};

router.get("/", asyncHandler(async (req, res) => {
    const boardgames = await Boardgame.findAll({
        include: bgIncludeArr
    });
    res.render("pages/boardgames/index", {boardgames});
}));

router.get("/new", needLogin, asyncHandler(async (req, res) => {
    const allCreators = await Creator.findAll();
    const allPublishers = allCreators.filter(c => c.type == "publisher");
    const allDesigners = allCreators.filter(c => c.type == "designer");
    res.render("pages/boardgames/new", {BGCategories, allPublishers, allDesigners});
}));

router.get("/:id", asyncHandler(async (req, res, next) => {
        const game = await Boardgame.findByPk(req.params.id, {
            include:[...bgIncludeArr, reviewModelObj]
        });
        if (!game) throw new ExpressError("Boardgame not found", 404);
        res.render("pages/boardgames/showpage", {game});
}));

router.get("/:id/edit", asyncHandler(async (req, res, next) => {
    const allCreators = await Creator.findAll();
    const allPublishers = allCreators.filter(c => c.type == "publisher");
    const allDesigners = allCreators.filter(c => c.type == "designer");
    const game = await Boardgame.findByPk(req.params.id, {
        include: bgIncludeArr
    });
    if (!game) throw new ExpressError("Boardgame not found", 404);
    res.render("pages/boardgames/edit", {game, BGCategories, allPublishers, allDesigners});
}));

router.post("/", asyncHandler(async (req, res, next) => {
    if (!req.body.boardgame || !req.body.publisherId || !req.body.designerIds) throw new ExpressError("Invalid data", 400);
    try {
        const newGame = await Boardgame.create(req.body.boardgame);
        await newGame.addCreator(req.body.publisherId);
        for (const id of req.body.designerIds) newGame.addCreator(id);
        res.redirect(`/boardgames/${newGame.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
})); 

router.put("/:id", asyncHandler(async (req, res, next) => {
    if (!req.body.boardgame) throw new ExpressError("Invalid data", 400);
    try {
        const game = await Boardgame.findByPk(req.params.id);
        if (!game) throw new ExpressError("Boardgame not found", 404);
        await game.update(req.body.boardgame);
        res.redirect(`/boardgames/${game.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
}));

router.delete("/:id", asyncHandler(async (req, res, next) => {
    const game = await Boardgame.findByPk(req.params.id);
    await Review.destroy({where: {boardgameId: game.id}}); // perhaps optional with ON DELETE: CASCADE
    await game.setTags([]);
    await game.destroy();
    res.redirect("/boardgames");
}));

module.exports = router;