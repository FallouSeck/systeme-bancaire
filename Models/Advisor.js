const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const AdvisorSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref:"Manager", required: true},
    creationDate: { type: Date }
})

module.exports = mongoose.model("Advisor", AdvisorSchema);