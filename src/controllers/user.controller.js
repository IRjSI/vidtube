import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new ApiError(404, 'user not found')
        }
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({ ValidityBeforeSave: false })
    
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error);
        throw new ApiError(500, 'Error generating token')
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const { username, fullname, password, email } = req.body; 
    //images(avatar and coverImage) are not coming through 'body' it is coming from 'req.files', handled with multer
    const existing = await UserModel.findOne({
        $or: [ { username } , { email } ]
    })
    if (existing) {
        throw new ApiError(409, 'user already exists')
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

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

    return res.json(new ApiResponse(201, newUser, 'User registered'))
})

const loginUser = asyncHandler(async (req,res) => {
    const { username, email, password } = req.body

    const user = await UserModel.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, 'user not found')
    }

    const isMatch = await UserModel.isPasswordCorrect(password)
    if (!isMatch) {
        throw new ApiError(401, 'Invalid creds')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).json(new ApiResponse(200, { user }, 'user logged in'))
})

const logoutUser = asyncHandler(async (req,res) => {
    await UserModel.findByIdAndUpdate(
        req.user._id, // since we stored user in req in auth middleware
        {
            $set: {
                refreshToken: ''
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV || "production"
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged out successfully'))
})

const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Refresh token is required');
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_SECRET);
        const user = await UserModel.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, 'invalid refresh token');
        }

        if (user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, 'invalid refresh token');
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV || "production"
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)    
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)   
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    'access token refreshed successfully'
                )
            );
    } catch (error) {
        throw new ApiError(500, 'something went wrong while refreshing token');
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken };