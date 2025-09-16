const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const ExpressError = require("../utils/expressError");

const {Boardgame, Creator} = require("../models");

router.get("/", asyncHandler(async (req, res) => {
    const creators = await Creator.findAll();
    res.render("pages/creators/index", {creators});
}));

router.get("/new", (req, res) => {
    res.render("pages/creators/new");
});

router.get("/:id", asyncHandler(async (req, res) => {
    const creator = await Creator.findByPk(req.params.id, {
        include: {model: Boardgame, as: "boardgames", attributes: ["name", "id", "description"]}
    });
    if (!creator) throw new ExpressError("Creator not found", 404);
    res.render("pages/creators/show", {creator});
}));

router.get("/:id/edit", asyncHandler(async (req, res) => {
    const creator = await Creator.findByPk(req.params.id);
    if (!creator) throw new ExpressError("Creator not found", 404);
    res.render("pages/creators/edit", {creator});
}));

router.post("/", asyncHandler(async (req, res, next) => {
    if (!req.body.creator) throw new ExpressError("Invalid data", 400);
    try {
        const newCreator = await Creator.create(req.body.creator);
        res.redirect(`/creators/${newCreator.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
}));

router.put("/:id", asyncHandler(async (req, res, next) => {
    if (!req.body.creator) throw new ExpressError("Invalid data", 400);
    try {
        const creator = await Creator.findByPk(req.params.id);
        if (!creator) throw new ExpressError("Creator not found", 404);
        await creator.update(req.body.creator);
        res.redirect(`/creators/${creator.id}`);
    } catch(err) {
        if (err.name == "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        }
    }
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const creator = await Creator.findByPk(req.params.id);
    await creator.destroy();
    res.redirect("/creators");
}));

module.exports = router;