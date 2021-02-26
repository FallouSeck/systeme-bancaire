const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const BankAccountSchema = new Schema({
    type: { type: String, enum:["current", "saving"], required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    amount: { type: Number, default: 0, required: true },
    creationDate: { type: Date }
}); 

module.exports = mongoose.model("BankAccount", BankAccountSchema);