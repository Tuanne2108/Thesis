import 'dotenv/config';
import express from 'express';
import { connectMongoDB } from './config/mongoDb.js';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.API_PORT;
const corsOptions = {
    origin: "http://localhost:5173",
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

connectMongoDB();
app.listen(port, () => console.log(`Server running on port ${port}`));
