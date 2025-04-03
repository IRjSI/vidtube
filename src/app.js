import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import router from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/v1/healthcheck',router);
app.use('/api/v1/users', userRouter);

app.use(errorHandler);
export { app };