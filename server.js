const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const methodOverride = require("method-override");

const sequelize = require("./config/database")

const ExpressError = require("./utils/expressError");

const bgRouter = require("./routers/bgRouter");

require("./models/refs");

const app = express();

const PORT = 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.use("/boardgames", bgRouter);

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
