const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    images: [{
        type: Buffer,
        required: true,
    }],
    title: String,
    price: Number,
    ingredients:String,
    category: String,
    description: String,
});

module.exports = mongoose.model("Recipe", recipeSchema);