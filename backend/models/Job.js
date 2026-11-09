
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    salary: Number,
    description: String,
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Job", jobSchema);
