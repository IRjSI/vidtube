import express from "express";
import { getUser, getUserByQuery, googleLogin, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateDetails, updatePassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// we also want avatar and coverImage
userRouter.post('/register', upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/auth', googleLogin);
userRouter.post('/refresh-token', refreshAccessToken);

userRouter.post('/logout', verifyJWT, logoutUser);
userRouter.post('/change-password', verifyJWT, updatePassword);
userRouter.get('/get-user', verifyJWT, getUser);
userRouter.get('/get-user-search/:username', verifyJWT, getUserByQuery);
userRouter.post('/update-details', verifyJWT, updateDetails);
userRouter.patch('/update-details', verifyJWT, updateDetails);
userRouter.patch('/update-avatar', verifyJWT, upload.single('avatar'), updateAvatar);
userRouter.patch('/update-cover-image', verifyJWT, upload.single('coverImage'), updateCoverImage);

export default userRouter;