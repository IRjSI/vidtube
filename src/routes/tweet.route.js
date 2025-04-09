import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller";

const tweetRouter = express.Router();

tweetRouter.post('/create', verifyJWT, createTweet);
tweetRouter.get('/get-all-tweets', verifyJWT, getUserTweets);
tweetRouter.patch('/update', verifyJWT, updateTweet);
tweetRouter.delete('/delete', verifyJWT, deleteTweet);

export default tweetRouter;