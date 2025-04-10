import express from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRouter = express.Router();

playlistRouter.post('/create', verifyJWT, createPlaylist);
playlistRouter.get('/get', verifyJWT, getUserPlaylists);
playlistRouter.get('/get/:playlistId', verifyJWT, getPlaylistById);
playlistRouter.post('/add/:playlistId/:videoId', verifyJWT, addVideoToPlaylist);
playlistRouter.post('/remove/:playlistId/:videoId', verifyJWT, removeVideoFromPlaylist);
playlistRouter.delete('/delete/:playlistId', verifyJWT, deletePlaylist);
playlistRouter.patch('/update/:playlistId', verifyJWT, updatePlaylist);

export default playlistRouter;