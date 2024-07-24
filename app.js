const express = require("express");
const app = express();
require("dotenv").config();
require("./config/database");
const path = require("path");
const cors = require("cors");

const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.resolve(__dirname, "client", "build")));

// API Routes
app.use("/api/v1", UserAPI);
app.use("/api/v1", TaskAPI);

// Backend message route
app.get("/backend", (req, res) => {
    res.send("Backend");
});

// Serve the React app for all other routes
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});