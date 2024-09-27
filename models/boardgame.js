const mongoose = require("mongoose");

const BoardgameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Producte name required."]
    },

    description: {
        type: String,
        required: [true, "Product description required."]
    },

    price: {
        type: Number,
        required: [true, "Product price required."],
        min: [0.1, "Price must be positive"]
    },

    category: {
        type: String,
        enum: ["Strategy", "Party", "Card Game", "Classic", "RPG", "Family", "Uncategorized"],
        required: [true, "Boardgame category required."]
    },

    tags: {
        type: [String]
    },

    imageUrl: {
        type: String,
        required: [true, "Image URL required."]
    },

    /*stock: {
        type: Number,
        //required: true [WILL ADD THIS LATER]
        min: [0, "Stock quantity can't be negative."]
    },*/

    /*rating: {
        type: Number,
        default: 0,
        min: 1,
        max: 5
    },*/

    minPlayers: {
        type: Number,
        //required: true,
        min: 1
    },

    maxPlayers: {
        type: Number,
        //required: true,
        min: 1
    },

    playtime: {
        type: String
    },

    age: {
        type: String,
        //required: true
    },

    designer: {
        type: String
    },

    publisher: {
        type: String
    },

    releaseYear: {
        type: Number
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    isExpansion: {
        type: Boolean,
        default: false
    },

    /*reviews: {
        // User schema reference, will add later
    },*/
    
}, {timestamps: true});

module.exports = mongoose.model("Boardgame", BoardgameSchema);