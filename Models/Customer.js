const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const CustomerSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    birthday: { type: Date, required: true },
    adress: {
        number: { type: Number }, 
        street: { type: String },
        zipCode: { type: Number },
        city: { type: String },
        country: { type: String }
    },
    bankAuthorisation: { type: String, enum: ['authorized', 'prohibited'], default: 'authorized', required: true },
    advisorId: { type: mongoose.Schema.Types.ObjectId, ref: "Advisor", required: true },
    creationDate: { type: Date }
});

module.exports = mongoose.model("Customer", CustomerSchema);