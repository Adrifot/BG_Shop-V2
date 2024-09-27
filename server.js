const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const Boardgame = require("./models/boardgame");
const BGCategories = ["Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"];

mongoose.connect("mongodb://localhost:27017/bgshop");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("MongoDB connected successfully.");
});

const app = express();

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
    const boardgames = await Boardgame.find({});
    res.render("pages/boardgames/index", {boardgames});
});

app.get("/boardgames/new", (req, res) => {
    res.render("pages/boardgames/new", {BGCategories});
});

app.get("/boardgames/:id", async (req, res) => {
    const game = await Boardgame.findById(req.params.id);
    res.render("pages/boardgames/showpage", {game});
});

app.get("/boardgames/:id/edit", async (req, res) => {
    const game = await Boardgame.findById(req.params.id);
    res.render("pages/boardgames/edit", {game, BGCategories});
});

app.post("/boardgames", async (req, res) => {
    const newGame = new Boardgame(req.body.boardgame);
    await newGame.save();
    res.redirect(`/boardgames/${newGame._id}`);
}); 

app.put("/boardgames/:id", async (req, res) => {
    const game = await Boardgame.findByIdAndUpdate(req.params.id, {...req.body.boardgame});
    res.redirect(`/boardgames/${game._id}`);
});

app.delete("/boardgames/:id", async (req, res) => {
    await Boardgame.findByIdAndDelete(req.params.id);
    res.redirect("/boardgames");
});

app.listen(3030, () => {
    console.log("Server started on port 3030.");
});