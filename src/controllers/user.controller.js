import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req,res) => {
    const { username, fullname, password, email } = req.body; 
    //images(avatar and coverImage) are not coming through 'body' it is coming from 'req.files', handled with multer
    const existing = await UserModel.findOne({
        $or: [ { username } , { email } ]
    })
    if (existing) {
        throw new ApiError(409, 'user already exists')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, 'avatar file is required')
    }

    // send this images on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : '';

    const newUser = await UserModel.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase()
    })
    if (!newUser) {
        throw new ApiError(500, 'Error creating user')
    }
})

export { registerUser };