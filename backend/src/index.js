const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./routes");
const dotenv = require("dotenv");
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.API_PORT;
const uri = process.env.MONGO_URI;
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

//Configuration
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
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
