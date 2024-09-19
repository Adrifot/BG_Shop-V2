const mongoose = require("mongoose");
const Boardgame = require("../models/boardgame");
const {gameName1, gameName2, categories, tags} = require("./gameseeds");

mongoose.connect("mongodb://localhost:27017/bgshop");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Database connection error: "));
db.once("open", () => {
    console.log("MongoDB connected.");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Boardgame.deleteMany({});
    for(let i=0; i<25; i++) {
        let minPl = Math.floor(Math.random() * (5-1) + 1);
        let maxPl = Math.floor(Math.random() * (7-minPl) + minPl);
        const newBoardgame = new Boardgame({
            name: `${sample(gameName1)} ${sample(gameName2)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem atque earum nesciunt molestiae. Blanditiis impedit perferendis quidem reiciendis vel enim, cupiditate nesciunt unde reprehenderit mollitia, at neque placeat sit quasi \
                            Ab deserunt modi exercitationem mollitia a, rerum, facere laborum ipsum sed asperiores nobis unde quasi magni veniam, minus molestiae cumque recusandae! Veniam ipsum odio officia? Voluptas corrupti fugiat labore? Quasi.",
            price: Math.floor(Math.random() * (300 - 10) + 10),
            category: `${sample(categories)}`,
            tags: `${sample(tags)}`,
            imageUrl: `https://picsum.photos/300?random=${Math.random()}`,
            minPlayers: minPl,
            maxPlayers: maxPl,
            releaseYear: Math.floor(Math.random() * (2024 - 1985) + 1985)
        });
        await newBoardgame.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});