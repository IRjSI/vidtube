import { PlaylistModel } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    const newPlaylist = await PlaylistModel.create({
        name,
        description,
        owner: req.user?._id
    })
    if (!newPlaylist) {
        throw new ApiError(400, 'playlist creating error')
    }

    return res.status(200).json(new ApiResponse(201, newPlaylist, 'playlist created'))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    const playlists = await PlaylistModel.find({ owner: userId }) // never returns null or undefined, returns empty array if nothing found
    if (!playlists.length) {
        throw new ApiError(404, 'playlists not found')
    }

    return res.status(200).json(new ApiResponse(200, playlists, 'all playlists'))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    const playlist = await PlaylistModel.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, 'playlist not found')
    }

    return res.status(200).json(new ApiResponse(200, playlist, 'single playlist'))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const playlistToBeUpdated = await PlaylistModel.findById(playlistId)
    
    if (!playlistToBeUpdated?.videos?.includes(videoId)) { // add the video if not in playlist
        playlistToBeUpdated.videos.push(videoId)
        await playlistToBeUpdated.save({ validateBeforeSaving: false })
    }

    return res.status(200).json(new ApiResponse(200, playlistToBeUpdated, 'video added successfully'));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    const playlistToBeUpdated = await PlaylistModel.findById(playlistId)
    
    playlistToBeUpdated.video = playlistToBeUpdated.video.filter(item => item !== videoId)
    await playlistToBeUpdated.save({ validateBeforeSaving: false })

    return res.status(200).json(new ApiResponse(200, playlistToBeUpdated, 'video removed successfully'));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    await PlaylistModel.findByIdAndDelete(playlistId)

    return res.status(200).json(new ApiResponse(200, {}, 'playlist deleted'));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
    const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(playlistId, {
        $set: {
            name,
            description
        }
    }, { new: true })

    return res.status(200).json(new ApiResponse(200, updatedPlaylist, 'playlist deleted'));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}