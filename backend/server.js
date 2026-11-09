
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Job Portal Backend Running!");
});

app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/applications",
    require("./routes/applicationRoutes"));

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
});
