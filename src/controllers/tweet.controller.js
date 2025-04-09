import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { TweetModel } from "../models/tweet.model.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;

    const newTweet = await TweetModel.create({
        content,
        owner: req.user?._id
    })
    if (!newTweet) {
        throw new ApiError(400, 'error creating tweet')
    }

    return res.status(200).json(new ApiResponse(201, newTweet, 'Tweet created'))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const tweets = await TweetModel.find({ owner: req.user?._id });
    if (!tweets) {
        throw new ApiError(404, 'no tweets found')
    }
    
    return res.status(200).json(new ApiResponse(200, tweets, 'All tweets'))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { newContent } = req.body;
    const tweet = await TweetModel.findByIdAndUpdate({ _id: tweetId, owner: req.user._id /* only owner can edit */ }, {
        $set: {
            content: newContent
        }
    }, { new: true })
    if (!tweet) {
        throw new ApiError(400, 'problem updating tweet')
    }

    return res.status(200).json(new ApiResponse(200, tweet, 'tweet updated'))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    await TweetModel.findByIdAndDelete({ _id: tweetId, owner: req.user._id })

    return res.status(200).json(new ApiResponse(200, {}, 'tweet deleted'))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}