const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    images: [{
        type: Buffer,
        required: true,
    }],
    title: String,
    price: Number,
    ingredients: String,
    category: String,
    description: String,
    rating: Number,
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        rating: Number,
    }],
});

module.exports = mongoose.model("Recipe", recipeSchema);