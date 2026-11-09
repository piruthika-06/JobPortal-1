const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/auth");

// View all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Post a new job
router.post("/", auth, async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Recruiter access required"
            });
        }

        const job = await Job.create({
            ...req.body,
            recruiter: req.user.id
        });

        res.status(201).json({
            message: "Job posted successfully",
            job
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;