const { faker } = require("@faker-js/faker");
const sequelize = require("../config/database");

const { Boardgame, Creator } = require("../models");

require("../models/refs");

const seedFakeData = async (count = 10) => {
  try {
    await sequelize.sync({ force: true });

    const creators = await Creator.bulkCreate(
        Array(10).fill().map(() => {
            if (Math.random() < 0.5) {
                return { name: faker.person.fullName(), type: "designer" };
            } else {
                return { name: faker.company.name(), type: "publisher" };
            }
        })
    );


    const boardgames = await Boardgame.bulkCreate(
      Array(count).fill().map(() => {
        const minPlayers = faker.number.int({ min: 1, max: 4 });
        const minPlaytime = faker.number.int({ min: 15, max: 60, multipleOf: 15 });

        return {
          name: `${faker.word.adjective()} ${faker.word.noun()}`,
          description: faker.lorem.paragraph(),
          price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
          category: faker.helpers.arrayElement([
            "Strategy", "Party", "Card Game", "Classic", "RPG", "Family"
          ]),
          imagesrc: `https://picsum.photos/300/200?random=${Math.random()}`,
          stock: faker.number.int({ min: 0, max: 50 }),
          minPlayers,
          maxPlayers: faker.number.int({ min: minPlayers + 1, max: 8 }),
          minPlaytime,
          maxPlaytime: faker.number.int({ min: minPlaytime + 15, max: 180, multipleOf: 15 }),
          age: faker.number.int({ min: 6, max: 18, multipleOf: 2 }),
          releaseYear: faker.number.int({ min: 1970, max: 2024 }),
          isExpansion: faker.datatype.boolean(),
        };
      })
    );

    for (const game of boardgames) {
        const publishers = creators.filter(c => c.type === "publisher");
        const designers = creators.filter(c => c.type === "designer");

        const publisher = faker.helpers.arrayElement(publishers);
        const chosenDesigners = faker.helpers.arrayElements(designers, faker.number.int({ min: 1, max: 3 }));

        await game.addCreators([publisher, ...chosenDesigners]);
    }

    console.log(`Generated ${count} fake boardgames with ${creators.length} creators.`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
};


seedFakeData(15);