const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title: String,
    video: Buffer,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Video", videoSchema);
