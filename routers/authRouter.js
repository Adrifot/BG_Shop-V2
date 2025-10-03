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

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

router.post("/register", asyncHandler(async (req, res, next) => {
    const newUser = req.body.newuser;
    newUser.pswdhash = newUser.password; // temporary, used for testing only

    const existingUser = await User.findOne({ where: { username: newUser.username } });
    if (existingUser) {
        throw new ExpressError("Username already taken", 400);
    }

    const user = await User.create(newUser);
    req.login(user, (err) => {
        if (err) return next(err);
        res.redirect("/");
    });
}));

module.exports = router;