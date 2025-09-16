const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const ExpressError = require("../utils/expressError");

const {Boardgame, Publisher} = require("../models");

router.get("/", asyncHandler(async (req, res) => {
    const publishers = await Publisher.findAll();
    res.render("pages/publishers/index", {publishers});
}));

router.get("/:id", asyncHandler(async (req, res) => {
    const publisher = await Publisher.findByPk(req.params.id, {
        include: {model: Boardgame, attributes: ["name", "id"]}
    });
    if (!publisher) throw new ExpressError("Publisher not found", 404);
    res.render("pages/publishers/show", {publisher});
}));

module.exports = router;