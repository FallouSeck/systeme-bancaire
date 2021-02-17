const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const BankAccountSchema = new Schema({
    type: { type: String, enum:["current", "saving"], default: "current", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    creationDate: { type: Date }
}); 

module.exports = mongoose.model("BankAccount", BankAccountSchema);