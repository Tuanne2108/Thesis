const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.API_PORT;
const uri = process.env.MONGO_URI;

//Configuration
app.use(express.json());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
routes(app);

// Connect to MongoDB
mongoose
    .connect(uri)
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => console.log(`Server running on port ${port}`));
