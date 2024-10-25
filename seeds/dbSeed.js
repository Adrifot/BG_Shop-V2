const sequelize = require("../config/database");
const Boardgame = require("../models/boardgame");
const {gameName1, gameName2, categories, tags} = require("./gameseeds");

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Sequelize connected.");
        await Boardgame.destroy({where: {}, truncate: true});
        for(let i=0; i<25; i++) {
            let minPl = Math.floor(Math.random() * (5-1) + 1);
            let maxPl = Math.floor(Math.random() * (7-minPl) + minPl);
            const newBoardgame = {
                name: `${sample(gameName1)} ${sample(gameName2)}`, //'Bandit Adventure',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
                price: Math.floor(Math.random() * (300 - 10) + 10),//84,
                category: `${sample(categories)}`, //'Uncategorized',
                stock: 1,
                age: 12,
                imagesrc: `https://picsum.photos/300?random=${Math.random()}`, //'https://picsum.photos/300?random=0.16288263637136824',
                minplayers: minPl,
                maxplayers: maxPl,
                releaseyear:Math.floor(Math.random() * (2024 - 1985) + 1985), // 1996,
                rating: 0, 
                isavailable: true,
                isexpansion: false,
            };
            await Boardgame.create(newBoardgame);
        }
    } catch(err) {
        console.error("Error seeding database: ", err);
    } finally {
        await sequelize.close();
        console.log("DB connection closed.");
    }
}

console.log("Seeding process initialized...");
seedDB();

