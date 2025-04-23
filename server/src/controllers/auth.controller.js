import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import { generateToken } from "../lib/utils.js";


export const signup = async (req, res) => {
    const { fullName, email, password, displayName } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" })
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 Characters" });
        }

        const user = await User.findOne({ email })

        if (user) { return res.status(400).json({ message: "Email already in use" }); }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPass,
            displayName: hashedPass.substring(1, 8),
        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid User Data" });
        }
    } catch (err) {
        console.log("Error in Signup Controller: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invaild Credentials" })
        }

        const isPassCorrect = await bcrypt.compare(password, user.password);

        if (!isPassCorrect) { return res.status(400).json({ message: "Invaild Credentials" }) };

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (err) {
        console.log("Error in Login Controller: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("JWT", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout Succesful" });

    } catch (err) {
        console.log("Error in Logout Controller: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { displayName } = req.body;
        const userId = req.user._id;

        if (!displayName) {
            return res.status(400).json({ message: "New Display Name is Required" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { displayName }, { new: true });

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error in Update Profile: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.log("Error in checkAuth controller", err.message);
        res.status(500).json({ message: "Internal Server Error"});        
    }
}