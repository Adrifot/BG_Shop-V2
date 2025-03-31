const express = require("express");
const router = express.Router();

const asyncHandler = require("../utilities/asyncHandler");
const ExpressError = require("../utilities/expressError");

const Boardgame = require("../models/boardgame");
const Review = require("../models/review");

const BGCategories = ["Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"];

router.get("/", asyncHandler(async (req, res) => {
    const boardgames = await Boardgame.findAll();
    res.render("pages/boardgames/index", {boardgames});
}));

router.get("/new", (req, res) => {
    res.render("pages/boardgames/new", {BGCategories});
});

router.get("/:id", asyncHandler(async (req, res, next) => {
        const game = await Boardgame.findByPk(req.params.id);
        if (!game) throw new ExpressError("Boardgame not found", 404);
        const reviews = await Review.findAll({where: {boardgameId: game.id}});
        res.render("pages/boardgames/showpage", {game, reviews});
}));

router.get("/:id/edit", asyncHandler(async (req, res, next) => {
    const game = await Boardgame.findByPk(req.params.id);
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
    await Review.destroy({where: {boardgameId: game.id}});
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
    review.destroy();
    res.redirect(`/boardgames/${req.params.id}`);
}));

module.exports = router;