const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");

router.get("/login", (req, res) => {
    res.render("pages/login");
});

router.get("/register", (req, res) => {
    res.render("pages/register");
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

router.post("/register", asyncHandler(async (req, res) => {
    await User.register(req.body.newuser);
    res.redirect("/login");
}));

module.exports = router;