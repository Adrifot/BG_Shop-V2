const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const ExpressError = require("../utils/expressError");

const {Boardgame, Review} = require("../models");

const BGCategories = ["Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"];

const bgIncludeArr = [
    {association: "designer", attributes: ["name", "id"]},
    {association: "publisher", attributes: ["name", "id"]},
    {association: "tags", attributes: ["tagname", "id"]},
];

const reviewModelObj = {model: Review, include: {association: "user", attributes: ["id", "username", "profilepic"]}};

router.get("/", asyncHandler(async (req, res) => {
    const boardgames = await Boardgame.findAll({
        include: bgIncludeArr
    });
    res.render("pages/boardgames/index", {boardgames});
}));

router.get("/new", (req, res) => {
    res.render("pages/boardgames/new", {BGCategories});
});

router.get("/:id", asyncHandler(async (req, res, next) => {
        const game = await Boardgame.findByPk(req.params.id, {
            include:[...bgIncludeArr, reviewModelObj]
        });
        if (!game) throw new ExpressError("Boardgame not found", 404);
        res.render("pages/boardgames/showpage", {game});
}));

router.get("/:id/edit", asyncHandler(async (req, res, next) => {
    const game = await Boardgame.findByPk(req.params.id, {
        include: bgIncludeArr
    });
    if (!game) throw new ExpressError("Boardgame not found", 404);
    res.render("pages/boardgames/edit", {game, BGCategories});
}));

router.post("/", asyncHandler(async (req, res, next) => {
    if (!req.body.boardgame) throw new ExpressError("Invalid data", 400);
    try {
        const newGame = await Boardgame.create(req.body.boardgame);
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

router.post("/:id/reviews", asyncHandler(async (req, res, next) => {
    if (!req.body.review) throw new ExpressError("Invalid data", 400);
    try {
        const game = await Boardgame.findByPk(req.params.id);
        await Review.create({...req.body.review, boardgameId: game.id});
        res.redirect(`/boardgames/${game.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
}));

router.delete("/:id/reviews/:reviewId", asyncHandler(async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) throw new ExpressError("Review not found", 404);
    await review.destroy();
    res.redirect(`/boardgames/${req.params.id}`);
}));

module.exports = router;