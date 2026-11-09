
const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const Job = require("../models/Job");
const auth = require("../middleware/auth");

// Apply for a job
router.post("/:jobId", auth, async (req, res) => {
    try {
        if (req.user.role !== "jobseeker") {
            return res.status(403).json({
                message: "Job seeker access required"
            });
        }

        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const exists = await Application.findOne({
            user: req.user.id,
            job: job._id
        });

        if (exists) {
            return res.status(400).json({
                message: "Already applied"
            });
        }

        const application = await Application.create({
            user: req.user.id,
            job: job._id
        });

        res.status(201).json({
            message: "Application submitted",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Recruiter views applications
router.get("/job/:jobId", auth, async (req, res) => {
    try {
        if (req.user.role !== "recruiter") {
            return res.status(403).json({
                message: "Recruiter access required"
            });
        }

        const job = await Job.findOne({
            _id: req.params.jobId,
            recruiter: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const applications = await Application.find({
            job: job._id
        }).populate("user", "name email");

        res.json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
