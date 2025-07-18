import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import router from "./routes/healthCheck.route.js";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import videoRouter from "./routes/video.route.js";
import tweetRouter from "./routes/tweet.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import playlistRouter from "./routes/playlist.route.js";
import likeRouter from "./routes/like.route.js";
import commentRouter from "./routes/comment.route.js";
import { Server } from 'socket.io';

const app = express();

app.use(cors({
    origin: ['https://vidtube-fe.vercel.app', 'http://localhost:5173', 'https://vidtubebe.onrender.com'],  // your FE origin
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

import { createServer } from 'node:http';
import socketHandler from "./ws/index.js";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['https://vidtube-fe.vercel.app', 'http://localhost:5173', 'https://vidtubebe.onrender.com'],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

socketHandler(io)

app.use('/api/v1/healthcheck',router);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/tweets', tweetRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/comments', commentRouter);

app.use(errorHandler);
export { app, server };