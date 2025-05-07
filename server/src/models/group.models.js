import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupCode: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

groupSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Utility function to generate a random group code
const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 10); // Generates an 8-character alphanumeric string
};

// Pre-save middleware to generate a unique groupCode
groupSchema.pre('validate', async function (next) {
    if (!this.groupCode) {
        let isUnique = false;
        while (!isUnique) {
            const newGroupCode = generateGroupCode();
            const existingGroup = await mongoose.models.Group.findOne({ groupCode: newGroupCode });
            if (!existingGroup) {
                this.groupCode = newGroupCode;
                isUnique = true;
            }
        }
    }
    next();
});


const Group = mongoose.model('Group', groupSchema);

export default Group;