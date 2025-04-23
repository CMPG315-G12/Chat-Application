import Message from "../models/message.model.js";
import User from "../models/user.models.js";

//Returns an array with the "friend" objects
export const getUsersForContactList = async (req, res) => {
    try {

        const loggedInUserId = req.user._id;
        const returnList = "_id email displayName";
        const filteredUsers = await User.findById(loggedInUserId).populate({ path: "friends", select: `${returnList}` }).select("friends");

        res.status(200).json(filteredUsers);
    } catch (err) {
        console.log("Error in getUsersForContactList: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Recipient is the destiantions of the messages - 1:1 = recipiant userId
export const getMessages = async (req, res) => {
    try {
        const { id: recipiant } = req.params;
        const userId = req.user._id;

        //Get all messages sent and recived between the two users 
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: recipiant },
                { senderId: recipiant, recipientId: userId }
            ]
        })

        res.status(200).json(messages);
    } catch (err) {
        console.log("Error in getMessages Controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: recipiantId } = req.params;
        const senderId = req.user._id;

        //TODO: Image Sending
        let ImageURL;
        if (image) {
            //Implement Image API
        }

        const newMessage = new Message({
            senderId: senderId,
            recipientId, recipiantId,
            text: text,
            //image: <insert ref to image>
        })

        await newMessage.save();

        //TODO:socket.io for realtime


        res.status(201).json(newMessage);
    } catch (err) {
        console.log("Error in sendMessageController: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}