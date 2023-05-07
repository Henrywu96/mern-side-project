import express from "express";
import "express-async-errors";
const app = express();
import cors from 'cors';
import dotenv from "dotenv";
dotenv.config();
import morgan from 'morgan';

import { dirname } from 'path';
import { fileURLToPath } from "url";
import path from 'path';

import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

// cookie
import cookieParser from "cookie-parser";

// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRouter.js";
import jobsRouter from "./routes/jobsRouter.js";

// middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import authenticateUser from './middleware/auth.js';


if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(cookieParser());

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, './client/build')));

// app.get("/", (req, res) => {
//     res.json({msg: 'Welcome!'});
// });

// app.get("/api/v1", (req, res) => {
//     res.json({msg: 'API'});
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// direct get route to index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}...`);
        });
    } catch (err) {
        console.error(err);
    }
};
start();
