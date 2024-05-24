const express = require("express");
const cors = require("cors");
const {readdirSync} = require("fs");
const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
require('dotenv').config({path: './.env'});
const users = require("./routes/user");
const User = require("./models/User");
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

// Routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// Database
mongoose.connect(
    process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
    }
)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Error connecting to MongoDB", err));

server.listen(PORT, () => {
    console.log(`Server is running at ${PORT}..`);
});
