const express = require("express");
const router = express.Router({mergeParams: true});

const asyncHandler = require("../utils/asyncHandler");
const ExpressError = require("../utils/expressError");

const {Boardgame, Review} = require("../models");

router.post("/", asyncHandler(async (req, res, next) => {
    if (!req.body.review) throw new ExpressError("Invalid data", 400);
    const game = await Boardgame.findByPk(req.params.id);
    if (!game) throw new ExpressError("Boardgame not found", 404);
    try {
        await Review.create({...req.body.review, boardgameId: game.id});
        res.redirect(`/boardgames/${game.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
}));

router.delete("/:reviewId", asyncHandler(async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) throw new ExpressError("Review not found", 404);
    await review.destroy();
    res.redirect(`/boardgames/${req.params.id}`);
}));

module.exports = router;