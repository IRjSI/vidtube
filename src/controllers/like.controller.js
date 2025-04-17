import { LikeModel } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    const alreadyLiked = await LikeModel.findOne({
        video: videoId,
        likedBy: req.user?._id
    })
    if (alreadyLiked) {
        await LikeModel.deleteOne({
            video: videoId,
            likedBy: req.user?._id
        });
    } else {
        await LikeModel.create({
            video: videoId,
            likedBy: req.user?._id
        })
    }

    const isVideoLiked = await LikeModel.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    const videoLiked = isVideoLiked ? true : false

    return res.status(200).json(new ApiResponse(200, { videoLiked }, 'video liked/unliked'))
})

const videoLikeStatus = asyncHandler(async (req,res) => {
    const { videoId } = req.params
    const alreadyLiked = await LikeModel.findOne({
        video: videoId,
        likedBy: req.user?._id
    })
    if (alreadyLiked) {
        return res.status(200).json(new ApiResponse(200, { message: true }, 'video is already liked'))
    } else {
        return res.status(200).json(new ApiResponse(200, { message: false }, 'video is not liked'))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const alreadyLiked = await LikeModel.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })
    if (alreadyLiked) {
        await LikeModel.findByIdAndDelete(commentId)
    } else {
        await LikeModel.create({
            comment: commentId,
            likedBy: req.user?._id
        })
    }

    const isCommentLiked = await LikeModel.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    const commentLiked = isCommentLiked ? true : false

    return res.status(200).json(new ApiResponse(200, { commentLiked }, 'comment liked/unliked'))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const alreadyLiked = await LikeModel.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })
    if (alreadyLiked) {
        await LikeModel.findByIdAndDelete(tweetId)
    } else {
        await LikeModel.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })
    }

    const isTweetLiked = await LikeModel.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    const tweetLiked = isTweetLiked ? true : false

    return res.status(200).json(new ApiResponse(200, { tweetLiked }, 'tweet liked/unliked'))
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const allLikedVideos = await LikeModel.find({ likedBy: req.user?._id }).select("-tweet -comment")

    return res.status(200).json(new ApiResponse(200, allLikedVideos, 'all liked videos'))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    videoLikeStatus
}