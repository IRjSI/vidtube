import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const tweetRouter = express.Router();

tweetRouter.post('/create', verifyJWT, createTweet);
tweetRouter.get('/get-all-tweets', verifyJWT, getUserTweets);
tweetRouter.patch('/update/:tweetId', verifyJWT, updateTweet);
tweetRouter.delete('/delete/:tweetId', verifyJWT, deleteTweet);

export default tweetRouter;