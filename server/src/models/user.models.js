import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        displayName: {
            type: String,
            
        },
        friends: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;