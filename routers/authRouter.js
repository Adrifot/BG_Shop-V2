const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const asyncHandler = require("../middleware/asyncHandler");

router.get("/register", (req, res) => {
    res.render("pages/users/register");
});

router.post("/register", asyncHandler(async (req, res) => {
    await User.register(req.body.newuser);
    res.redirect("/login");
}));

router.get("/login", (req, res) => {
    res.render("pages/users/login");
});

router.post("/login", 
    passport.authenticate("local", { failureRedirect: "login" }), 
        (req, res) => {
            res.redirect("/");
        }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect("/home");
    });
});

module.exports = router;