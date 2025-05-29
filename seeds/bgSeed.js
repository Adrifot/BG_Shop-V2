const { faker } = require("@faker-js/faker");
const sequelize = require("../config/database");

const { Boardgame, Designer, Publisher } = require("../models");

require("../models/refs");

const seedFakeData = async (count = 10) => {
    try {
        await sequelize.sync({ force: true });

        const designers = await Designer.bulkCreate(
            Array(5).fill().map(() => ({
                name: faker.person.fullName()
            }))
        );

        const publishers = await Publisher.bulkCreate(
            Array(5).fill().map(() => ({
                name: faker.company.name()
            }))
        );

        const boardgames = await Boardgame.bulkCreate(
            Array(count).fill().map(() => ({
                name: `${faker.word.adjective()} ${faker.word.noun()}`,
                description: faker.lorem.paragraph(),
                price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
                category: faker.helpers.arrayElement(["Strategy", "Party", "Card Game", "Classic", "RPG", "Family"]),
                imagesrc: faker.image.urlLoremFlickr({ category: 'boardgame' }),
                stock: faker.number.int({ min: 0, max: 50 }),
                minPlayers: faker.number.int({ min: 1, max: 4 }),
                maxPlayers: faker.number.int({ min: 2, max: 8 }),
                minPlaytime: faker.number.int({ min: 15, max: 60 , multipleOf: 15}),
                maxPlaytime: faker.number.int({ min: 30, max: 180, multipleOf: 15}),
                age: faker.number.int({ min: 6, max: 18 , multipleOf: 2}),
                releaseYear: faker.number.int({ min: 1970, max: 2024 }),
                isExpansion: faker.datatype.boolean(),
                designerId: faker.helpers.arrayElement([...designers.map(d => d.id)]),
                publisherId: faker.helpers.arrayElement([...publishers.map(p => p.id)])
            }))
        );
        
        console.log(`Generated ${count} fake boardgames with ${designers.length} designers and ${publishers.length} publishers.`);
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await sequelize.close();
    }
};

seedFakeData(15);