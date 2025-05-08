import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" || "Group",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent"
        },
        readBy: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            readAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;