const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const methodOverride = require("method-override");

const sequelize = require("./config/database")
const passport = require("passport");
const session = require("express-session");

const ExpressError = require("./errors/expressError");

const bgRouter = require("./routers/bgRouter");
const reviewRouter = require("./routers/reviewRouter");
const creatorRouter = require("./routers/creatorRouter");
const authRouter = require("./routers/authRouter");

const app = express();

require("./auth/localStrategy");

const PORT = 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use('/libs', express.static(__dirname + '/node_modules/tom-select/dist'));

app.use(
    session({
        secret: "tobechangedlater",
        saveUninitialized: false,
        resave: false,
        cookie: {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.use("/boardgames", bgRouter);
app.use("/boardgames/:id/reviews", reviewRouter);
app.use("/creators", creatorRouter);
app.use("/", authRouter);

app.get(["/", "/home"], (req, res) => {
    res.render("pages/home");
});

app.get("/admin", (req, res) => {
    res.render("pages/adminpage");
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Oh no, something went wrong!";
    res.status(statusCode).render("pages/error", {err});
});

sequelize.sync({alter: true})
    .then(() => {
        app.listen(PORT, () => {
            console.log("Database synced.");
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Unable to connect to database: ", err);
    });
