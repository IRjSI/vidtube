import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import VideoModel from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { SubscriptionModel } from "../models/subscription.model.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const channels = await SubscriptionModel.find({ subscriber: req.user?._id }).select("channel");

    const videos = await VideoModel.aggregate([
        {
            "$match": {
                "owner": { $in: channels.map(channel => channel.channel) }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "owner",
                "foreignField": "_id",
                "as": "user"
            }
        }
    ]);
    if (!videos || videos.length === 0) {
        throw new ApiError(404, 'videos not found')
    }

    return res.status(200).json(new ApiResponse(200, videos, 'All videos'))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    // get video

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, 'Video file required')
    }

    // upload on cloudinary

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    // create video

    const newVideo = await VideoModel.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        owner: req.user?._id
    })
    if (!newVideo) {
        throw new ApiError(400, 'Error creating video')
    }

    return res.status(200).json(new ApiResponse(201, newVideo, 'Video uploaded'))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await VideoModel.findById(videoId);
    if (!video) {
        throw new ApiError(400, 'no video found')
    }
    
    return res.status(200).json(new ApiResponse(200, video, 'found video'))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'thumbnail file required')
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
        throw new ApiError(500, 'Something went wrong while uploading avatar')
    }

    const video = await VideoModel.findOneAndUpdate({ _id: videoId, owner: req.user._id }, {
        $set: {
            title,
            description,
            thumbnail: thumbnail.url
        }
    }, { new: true });
    if (!video) {
        throw new ApiError(404, 'video not found')
    }

    return res.status(200).json(new ApiResponse(200, video, 'Video updated'))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    await VideoModel.findOneAndDelete({ _id: videoId, owner: req.user._id });

    return res.status(200).json(new ApiResponse(200, {}, 'Video deleted'))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { status } = req.body;
    const video = await VideoModel.findOneAndUpdate({ _id: videoId, owner: req.user._id }, {
        $set: {
            isPublished: status
        }
    }, { new: true })
    if (video) {
        throw new ApiError(404, 'video not found')
    }

    return res.status(200).json(new ApiResponse(200, video, 'toggled'))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}