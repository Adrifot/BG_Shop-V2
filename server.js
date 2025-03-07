const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const methodOverride = require("method-override");

const sequelize = require("./config/database")
const Boardgame = require("./models/boardgame");
const Review = require("./models/review");
const BGCategories = ["Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"];

const ExpressError = require("./utilities/expressError");
const asyncHandler = require("./utilities/asyncHandler");

const app = express();

const PORT = 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

const Global = {
    sassDir: path.join(__dirname, "public/styles/sass"),
    cssDir: path.join(__dirname, "public/styles/css")
};

app.get(["/", "/home"], (req, res) => {
    res.render("pages/home");
});

app.get("/admin", (req, res) => {
    res.render("pages/adminpage");
});

app.get("/boardgames", asyncHandler(async (req, res) => {
    const boardgames = await Boardgame.findAll();
    res.render("pages/boardgames/index", {boardgames});
}));

app.get("/boardgames/new", (req, res) => {
    res.render("pages/boardgames/new", {BGCategories});
});

app.get("/boardgames/:id", asyncHandler(async (req, res, next) => {
        const game = await Boardgame.findByPk(req.params.id);
        if (!game) throw new ExpressError("Boardgame not found", 404);
        const reviews = await Review.findAll({where: {boardgameId: game.id}});
        res.render("pages/boardgames/showpage", {game, reviews});
}));

app.get("/boardgames/:id/edit", asyncHandler(async (req, res, next) => {
    const game = await Boardgame.findByPk(req.params.id);
    if (!game) throw new ExpressError("Boardgame not found", 404);
    res.render("pages/boardgames/edit", {game, BGCategories});
}));

app.post("/boardgames", asyncHandler(async (req, res, next) => {
    if (!req.body.boardgame) throw new ExpressError("Invalid data", 400);
    try {
        const newGame = await Boardgame.create(req.body.boardgame);
        res.redirect(`/boardgames/${newGame.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
})); 

app.put("/boardgames/:id", asyncHandler(async (req, res, next) => {
    if (!req.body.boardgame) throw new ExpressError("Invalid data", 400);
    try {
        const game = await Boardgame.findByPk(req.params.id);
        if (!game) throw new ExpressError("Boardgame not found", 404);
        await game.update(req.body.boardgame);
        res.redirect(`/boardgames/${game.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
}));

app.delete("/boardgames/:id", asyncHandler(async (req, res, next) => {
    const game = await Boardgame.findByPk(req.params.id);
    await Review.destroy({where: {boardgameId: game.id}});
    await game.destroy();
    res.redirect("/boardgames");
}));

app.post("/boardgames/:id/reviews", asyncHandler(async (req, res, next) => {
    if (!req.body.review) throw new ExpressError("Invalid data", 400);
    try {
        const game = await Boardgame.findByPk(req.params.id);
        await Review.create({...req.body.review, boardgameId: game.id});
        res.redirect(`/boardgames/${game.id}`);
    } catch(err) {
        if (err.name === "SequelizeValidationError") {
            const errmsgs = err.errors.map(error => error.message).join(", ");
            next(new ExpressError(errmsgs, 400));
        } else next(err);
    }
}));

app.delete("/boardgames/:id/reviews/:reviewId", asyncHandler(async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    review.destroy();
    res.redirect(`/boardgames/${req.params.id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Oh no, something went wrong!";
    res.status(statusCode).render("pages/error", {err});
});

function compileSass(sassPath, cssPath) {
    if (!cssPath) cssPath = path.basename(sassPath).split(".")[0] + ".css";
    if (!path.isAbsolute(sassPath)) sassPath = path.join(Global.sassDir, sassPath);
    if (!path.isAbsolute(cssPath)) cssPath = path.join(Global.cssDir, cssPath);
    resFile = sass.compile(sassPath, {"sourceMap": true, "quietDeps": true, "logger": sass.Logger.silent});
    fs.writeFileSync(cssPath, resFile.css);
}

const sassFiles = fs.readdirSync(Global.sassDir);
for(let file of sassFiles) {
    if (path.extname(file) == ".scss") compileSass(file);
}

fs.watch(Global.sassDir, (event, file) => {
    if (event == "change" || event == "rename") {
        let fullPath = path.join(Global.sassDir, file);
        if (fs.existsSync(fullPath)) compileSass(fullPath);
    }
});


sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Unable to connect to database: ", err);
    });
