const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const ExpressError = require("../utils/expressError");

const {Boardgame, Designer} = require("../models");

router.get("/", asyncHandler(async (req, res) => {
    const designers = await Designer.findAll();
    res.render("pages/designers/index", {designers});
}));

router.get("/:id", asyncHandler(async (req, res) => {
    const designer = await Designer.findByPk(req.params.id, {
        include: {model: Boardgame, attributes: ["name", "id", "description"]}
    });
    if (!designer) throw new ExpressError("Designer not found", 404);
    res.render("pages/designers/show", {designer});
}));

router.get("/:id/edit", asyncHandler(async (req, res) => {
    const designer = await Designer.findByPk(req.params.id);
    if (!designer) throw new ExpressError("Designer not found", 404);
    res.render("pages/designers/edit", {designer});
}));

router.put("/:id", asyncHandler(async (req, res, next) => {
    if (!req.body.designer) throw new ExpressError("Invalid data", 400);
    try {
        const designer = await Designer.findByPk(req.params.id);
        if (!designer) throw new ExpressError("Designer not found", 404);
        await designer.update(req.body.designer);
        res.redirect(`/designers/${designer.id}`);
    } catch(err) {
        if (err.name == "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        }
    }
}));

module.exports = router;