const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
