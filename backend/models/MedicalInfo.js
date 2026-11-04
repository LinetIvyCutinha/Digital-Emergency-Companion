
const mongoose = require("mongoose");

const medicalInfoSchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        default: ""
    },
    allergies: {
        type: String,
        default: ""
    },
    conditions: {
        type: String,
        default: ""
    },
    medications: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("MedicalInfo", medicalInfoSchema);
