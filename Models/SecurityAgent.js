const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const SecurityAgentSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    creationDate: { type: Date }
})

module.exports = mongoose.model("SecurityAgent", SecurityAgentSchema);