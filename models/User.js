const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    Recepies:
        [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
        ]
    ,
    favorite: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
    }]
})


module.exports = mongoose.model("User", userSchema);