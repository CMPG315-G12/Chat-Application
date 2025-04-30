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
            required: function () {
                return !this.providers || this.providers.length === 0;
            },
            minlength: 8,
        },
        providers: [
            {
                provider: {
                    type: String,
                    enum: ["google", "discord", "github"],
                    required: true,
                },
                providerId: {
                    type: String,
                    required: true,
                },
            },
        ],
        displayName: {
            type: String,
        },
        friends: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        profilePic: {
            type: String,
            default: function () {
                const randomIndex = Math.floor(Math.random() * 5);
                `https://cdn.discordapp.com/embed/avatars/${randomIndex}.png`
            },
        },

    },
    { timestamps: true },
);

// Add a compound index to ensure unique provider-providerId pairs
userSchema.index(
    { "providers.provider": 1, "providers.providerId": 1 },
    { unique: true, sparse: true }
);

const User = mongoose.model("User", userSchema);

export default User;