import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import router from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import videoRouter from "./routes/video.route.js";
import tweetRouter from "./routes/tweet.route.js";
import subscriptionRouter from "./routes/subscription.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/v1/healthcheck',router);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/tweet', tweetRouter);
app.use('/api/v1/subscription', subscriptionRouter);

app.use(errorHandler);
export { app };