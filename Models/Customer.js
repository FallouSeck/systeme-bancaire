const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const CustomerSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birthday: { type: Date, required: true },
    adress: { type: String, required: true },
    creationDate: Date
});

module.exports = mongoose.model("Customer", CustomerSchema);