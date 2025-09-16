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
        include: {model: Boardgame, attributes: ["name", "id"]}
    });
    if (!designer) throw new ExpressError("Designer not found", 404);
    res.render("pages/designers/show", {designer});
}));

module.exports = router;