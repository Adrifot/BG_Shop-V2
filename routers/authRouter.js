const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/login", (req, res) => {
    res.render("pages/users/login");
});

router.get("/register", (req, res) => {
    res.render("pages/users/register");
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/');
});

router.post("/register", asyncHandler(async (req, res) => {
    await User.register(req.body.newuser);
    res.redirect("/login");
}));

module.exports = router;