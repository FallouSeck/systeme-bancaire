const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const AdvisorSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true }
})

module.exports = mongoose.model("Advisor", AdvisorSchema);