import mongoose, {Schema} from "mongoose"

const friendSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})



export const FriendModel = mongoose.model("Friend", friendSchema)