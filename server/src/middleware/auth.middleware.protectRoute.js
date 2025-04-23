import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.JWT;

        if (!token) {
            return res.status(401).json({ message: "Unautherized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unautherized - No Token Provided" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Error in protectRoute Middleware: ", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}