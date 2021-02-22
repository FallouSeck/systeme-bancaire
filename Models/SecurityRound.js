const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const SecurityRoundSchema = new Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    comments: { type: String, required: true },
    creationDate: { type: Date }
})

module.exports = mongoose.model("SecurityRound", SecurityRoundSchema);