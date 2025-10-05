const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler");

passport.use(
    new LocalStrategy(asyncHandler(async (username, password, done) => {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) throw new Error("Wrong credentials.");
            const valid = await user.validatePassword(password);
            if (!valid) throw new Error("Wrong credentials.");
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }))
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});