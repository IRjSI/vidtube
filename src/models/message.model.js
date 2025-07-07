import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        friend: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        room: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const MessageModel = mongoose.model("Message", messageSchema)