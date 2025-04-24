import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            //Logic needed for if user tries to log in from diffrent platforms
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: function () { return !this.provider; },
            minlength: 8,
        },
        provider: { //Google, Github, Discord
            type: String,
            enum: ["google", "discord", "github", null], //Allow null incase they use email
            default: null
        },
        providerId: { //Unique ID from OAuth provider
            type: String,
            sparse: true, //Allows for nulls but unique otherwise
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

//Adds compound index to allow for quick lookup of OAuth users
userSchema.index({ provider: 1, providerId: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);

export default User;