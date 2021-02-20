const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const DirectorSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    creationDate: { type: Date }
})

module.exports = mongoose.model("Director", DirectorSchema);