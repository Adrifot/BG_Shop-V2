const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const sequelize = require("./config/database")
const Boardgame = require("./models/boardgame");
const BGCategories = ["Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"];

const app = express();

const PORT = 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.get(["/", "/home"], (req, res) => {
    res.render("pages/home");
});

app.get("/admin", (req, res) => {
    res.render("pages/adminpage");
});

app.get("/boardgames", async (req, res) => {
    const boardgames = await Boardgame.findAll();
    res.render("pages/boardgames/index", {boardgames});
});

app.get("/boardgames/new", (req, res) => {
    res.render("pages/boardgames/new", {BGCategories});
});

app.get("/boardgames/:id", async (req, res) => {
    const game = await Boardgame.findByPk(req.params.id);
    res.render("pages/boardgames/showpage", {game});
});

app.get("/boardgames/:id/edit", async (req, res) => {
    const game = await Boardgame.findByPk(req.params.id);
    res.render("pages/boardgames/edit", {game, BGCategories});
});

app.post("/boardgames", async (req, res) => {
    const newGame = await Boardgame.create(req.body.boardgame);
    res.redirect(`/boardgames/${newGame.id}`);
}); 

app.put("/boardgames/:id", async (req, res) => {
    const game = await Boardgame.findByPk(req.params.id);
    await game.update(req.body.boardgame);
    res.redirect(`/boardgames/${game.id}`);
});

app.delete("/boardgames/:id", async (req, res) => {
    const game = await Boardgame.findByPk(req.params.id);
    await game.destroy();
    res.redirect("/boardgames");
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