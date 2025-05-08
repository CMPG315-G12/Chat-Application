import Group from "../models/group.models.js";
import Message from "../models/message.model.js";
import User from "../models/user.models.js";

import { getRecieverSocketId, io} from "../lib/socket_io.js";

//Returns an array with the "friend" objects
export const getUsersForContactList = async (req, res) => {
    try {

        const loggedInUserId = req.user._id;
        const returnList = "_id email displayName profilePic";
        const filteredUsers = await User.findById(loggedInUserId)
            .populate({ path: "friends", select: returnList }) // Populate friends
            .populate({ path: "groups", select: "_id name description groupCode" }) // Populate groups
            .select("friends groups");

        res.status(200).json(filteredUsers);
    } catch (err) {
        console.log("Error in getUsersForContactList: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Recipient is the destiantions of the messages - 1:1 = recipiant userId
export const getMessagesU = async (req, res) => {
    try {
        const { id: recipient } = req.params;
        const userId = req.user._id;

        //Get all messages sent and recived between the two users 
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: recipient },
                { senderId: recipient, recipientId: userId }
            ]
        })

        res.status(200).json(messages);
    } catch (err) {
        console.log("Error in getMessages Controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//get group messages
export const getMessagesG = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id;

        //Get all messages sent and recived between the two users 
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: groupId },
                { recipientId: groupId }
            ]
        })

        res.status(200).json(messages);
    } catch (err) {
        console.log("Error in getMessages Controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessageU = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recipientId } = req.params;
        const senderId = req.user._id;

        //TODO: Image Sending
        let ImageURL;
        if (image) {
            //Implement Image API
        }

        const newMessage = new Message({
            senderId: senderId,
            recipientId: recipientId,
            text: text,
            //image: <insert ref to image>
        })

        await newMessage.save();

        const recipientSocketId = getRecieverSocketId(recipientId); // Get the socket ID of the recipient
   
        if (recipientSocketId) {      
            io.to(recipientSocketId).emit("UserMessage", {
                sender: senderId,
                message: newMessage
            }); // Emit the new message to the recipient
        }

        res.status(201).json(newMessage);
    } catch (err) {
        console.log("Error in sendMessageController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//send group message
export const sendMessageG = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: groupId } = req.params;
        const senderId = req.user._id;

        //TODO: Image Sending
        let ImageURL;
        if (image) {
            //Implement Image API
        }

        const newMessage = new Message({
            senderId: senderId,
            recipientId: groupId,
            text: text,
            //image: <insert ref to image>
        })

        await newMessage.save();
        

        const groupCode = await Group.findById(groupId).select("groupCode").lean(); // Get the group code from the group ID
        
        io.to(groupCode.groupCode).emit("GroupMessage", {
            sender: senderId,
            message: newMessage
        }); // Emit the new message to the group
        
        res.status(201).json(newMessage);
    } catch (err) {
        console.log("Error in sendMessageController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const newGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user._id;

        // Check if name is provided and not empty
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: "Group name is required" });
        }

        const newGroup = new Group({
            name: name,
            description: description,
            members: [userId],
            createdBy: userId
        })
        await newGroup.save();

        await User.findByIdAndUpdate(userId, { $push: { groups: newGroup._id } }, { new: true });
        res.status(201).json(newGroup);

    }
    catch (err) {
        console.log("Error in newGroupController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const joinGroup = async (req, res) => {
    const { id: groupCode } = req.params; // Extract groupCode from the request parameters
    const userId = req.user._id; // Get the user ID from the authenticated user

    try {
        // Find the group by groupCode
        const group = await Group.findOne({ groupCode }).populate("members", "_id");
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the user is already a member of the group
        const isAlreadyMember = group.members.some(member => member._id.toString() === userId.toString());

        if (isAlreadyMember) {
            return res.status(400).json({ message: "Already a member of the group" });
        }

        // Add userId to the group's members list
        await Group.findOneAndUpdate(
            { groupCode },
            { $addToSet: { members: userId } },
            { new: true }
        );

        // Add groupId to the user's groups list
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { groups: group._id } },
            { new: true }
        );

        res.status(200).json({ message: "Joined group successfully" });
    } catch (err) {
        console.log("Error in joinGroupController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const leaveGroup = async (req, res) => {
    const { id: groupCode } = req.params; // Extract groupCode from the request parameters
    const userId = req.user._id; // Get the user ID from the authenticated user

    try {
        // Find the group by groupCode
        const group = await Group.findOne({ groupCode }).populate("members", "_id");
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the user is already a member of the group
        const isAlreadyMember = group.members.some(member => member._id.toString() === userId.toString());

        if (!isAlreadyMember) {
            return res.status(400).json({ message: "Not Member in Group" });
        }

        // Remove userId to the group's members list
        await Group.findOneAndUpdate(
            { groupCode },
            { $pull: { members: userId } },
            { new: true }
        );

        // Remove groupId to the user's groups list
        await User.findByIdAndUpdate(
            userId,
            { $pull: { groups: group._id } },
            { new: true }
        );

        res.status(200).json({ message: "Left group successfully" });
    } catch (err) {
        console.log("Error in joinGroupController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addFirend = async (req, res) => {
    const { id: friendId } = req.params;
    const userId = req.user._id;

    try {

        // Check if the userId and friendId are the same
        if (userId.toString() === friendId.toString()) {
            return res.status(400).json({ message: "Cannot add yourself as a friend" });
        }

        // Check if the user is already friends with the friendId
        const user = await User.findById(userId).populate("friends");
        const isAlreadyFriend = user.friends.some(friend => friend._id.toString() === friendId);

        if (isAlreadyFriend) {
            return res.status(400).json({ message: "Already friends" });
        }

        // Add friendId to user's friends list
        await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } }, { new: true });

        // Add userId to friend's friends list
        await User.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } }, { new: true });

        res.status(200).json({ message: "Friend added successfully" });
    }
    catch (err) {
        console.log("Error in addFriendController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeFriend = async (req, res) => {
    const { id: friendId } = req.params;
    const userId = req.user._id;

    try {
        // Check if the userId and friendId are the same
        if (userId.toString() === friendId.toString()) {
            return res.status(400).json({ message: "Cannot remove yourself as a friend" });
        }
        // Check if the user is already friends with the friendId
        const user = await User.findById(userId).populate("friends");
        const isAlreadyFriend = user.friends.some(friend => friend._id.toString() === friendId);

        if (!isAlreadyFriend) {
            return res.status(400).json({ message: "Not friends" });
        }

        // Remove friendId from user's friends list
        await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }, { new: true });

        // Remove userId from friend's friends list
        await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } }, { new: true });

        res.status(200).json({ message: "Friend removed successfully" });
    }
    catch (err) {
        console.log("Error in removeFriendController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const markMessagesAsDelivered = async (req, res) => {
    try {
        const { id: senderId } = req.params; // The sender of the messages
        const userId = req.user._id; // The current user who received the messages

        // Find all undelivered messages from this sender to the current user
        const messages = await Message.updateMany(
            { 
                senderId: senderId,
                recipientId: userId,
                status: 'sent'
            },
            { 
                $set: { status: 'delivered' } 
            }
        );

        // Notify the sender about delivered messages
        const senderSocketId = getRecieverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messages:delivered", {
                userId: userId,
                timestamp: new Date()
            });
        }

        res.status(200).json({ message: "Messages marked as delivered" });
    } catch (err) {
        console.log("Error in markMessagesAsDelivered:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const markMessagesAsRead = async (req, res) => {
    try {
        const { id: senderId } = req.params; // The sender of the messages
        const userId = req.user._id; // The current user who is reading the messages

        // Find all delivered but unread messages from this sender to current user
        const messages = await Message.find({
            senderId: senderId,
            recipientId: userId,
            status: { $in: ['sent', 'delivered'] }
        });

        // Update each message's status and add current user to readBy
        const updates = messages.map(async (message) => {
            message.status = 'read';
            
            // Check if user already marked as read
            const alreadyRead = message.readBy.some(
                reader => reader.userId.toString() === userId.toString()
            );
            
            if (!alreadyRead) {
                message.readBy.push({
                    userId: userId,
                    readAt: new Date()
                });
            }
            
            return message.save();
        });
        
        await Promise.all(updates);

        // Notify the sender about read messages
        const messageIds = messages.map(msg => msg._id);
        const senderSocketId = getRecieverSocketId(senderId);
        if (senderSocketId && messageIds.length > 0) {
            io.to(senderSocketId).emit("messages:read", {
                userId: userId,
                messageIds: messageIds,
                timestamp: new Date()
            });
        }

        res.status(200).json({ 
            message: "Messages marked as read",
            count: messageIds.length
        });
    } catch (err) {
        console.log("Error in markMessagesAsRead:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};