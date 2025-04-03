import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ],
    refreshToken: {
        type: String
    }
}, { timestamps: true })

// when we have a method that is inclusively for the model so we don't write separately in controller
userSchema.pre("save", async function (next) {
    if (!this.modified("password")) return next()

    this.password = bcrypt.hash(this.password,10)

    next()
})

userSchema.method.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function() {
    // short lived token
    jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    }, 'secret...',)
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;