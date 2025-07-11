import { CommentModel } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    
    const comments = await CommentModel.find({ video: videoId }).populate('owner');
    if (!comments) {
        return res.json(new ApiResponse(404, 'comments not found'))
    }

    return res.json(new ApiResponse(200, comments, 'comment found'))
})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { videoId } = req.params
    const newComment = await CommentModel.create({
        content,
        video: videoId,
        owner: req.user?._id
    })
    
    return res.json(new ApiResponse(201, newComment, 'comment added'))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { newContent } = req.body
    const comment = await CommentModel.findOneAndUpdate({ _id: commentId }, {
        $set: {
            content: newContent
        }
    }, { new: true })
    
    return res.json(new ApiResponse(200, comment, 'comment update'))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    await CommentModel.findOneAndDelete({ _id: commentId })
    
    return res.json(new ApiResponse(200, {}, 'comment deleted'))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}