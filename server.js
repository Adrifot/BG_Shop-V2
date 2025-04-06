const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const methodOverride = require("method-override");

const sequelize = require("./config/database")

const ExpressError = require("./utilities/expressError");

const bgRouter = require("./routers/bgRouter");

const app = express();

const PORT = 3030;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));

app.use("/boardgames", bgRouter);

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

    // Compile Sass and write to file
    let resFile = sass.compile(sassPath, {"sourceMap": true, "quietDeps": true, "logger": sass.Logger.silent});
    fs.writeFileSync(cssPath, resFile.css);
    // console.log(`Compiled: ${sassPath} -> ${cssPath}`);
}


fs.watch(Global.sassDir, (event, file) => {
    if(event == "change" || event == "rename") {
        if (file == "custom.scss") {
            const sassFiles = fs.readdirSync(Global.sassDir);
            for (let file of sassFiles) {
                if (path.extname(file) == ".scss") compileSass(file);
            }
        }
        let fullPath = path.join(Global.sassDir, file);
        if(fs.existsSync(fullPath)) compileSass(file); 
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
