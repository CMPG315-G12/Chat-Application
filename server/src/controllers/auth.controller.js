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
            const token = generateToken(newUser._id, res);
            await newUser.save();

            res.cookie("JWT", token, { httpOnly: true, });
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                redirectUrl: `${process.env.CLIENT_URL}/`
            }); // Adjust the redirect URL as needed
            
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

        const token = generateToken(user._id, res);
        res.cookie("JWT", token, { httpOnly: true, });
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            redirectUrl: `${process.env.CLIENT_URL}/`
        }); // Adjust the redirect URL as needed

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
        res.status(200).json({ user: req.user });
    } catch (err) {
        console.log("Error in checkAuth controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

//Generic OAuth Callback Handler 
export const handleOAuthCallback = (req, res) => {
    console.log("OAuth Callback Handler Invoked");
    // Passport attaches the user object to req.user after successful authentication via the 'done(null, user)' call in your passport strategy config.
    if (!req.user) {
        console.error("OAuth callback missing user object");
        return res.status(500).json({ message: "Internal Server Error" });
    }

    try {
        // Log success, including provider info if available on req.user
        console.log(`OAuth successful for ${req.user.provider || 'provider'}, user:`, req.user.email);

        // Generate JWT and set cookie using your existing utility
        const token = generateToken(req.user._id, res);

        res.cookie("JWT", token, { httpOnly: true, });
        // Redirect to your frontend dashboard or desired page
        res.redirect(`${process.env.CLIENT_URL}/`); // Adjust the redirect URL as needed

    } catch (err) {
        console.error("Error generating token or redirecting after OAuth:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};