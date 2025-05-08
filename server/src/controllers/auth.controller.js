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

            // res.cookie("JWT", token, { httpOnly: true, });
            res.status(201).json({
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic
                },
                redirectUrl: `${process.env.CLIENT_URL}/`,
                token
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
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Handle users created through OAuth (they might not have a password)
        if (!user.password) {
            return res.status(400).json({ 
                message: "This account uses social login. Please sign in with the appropriate provider." 
            });
        }

        const isPassCorrect = await bcrypt.compare(password, user.password);

        if (!isPassCorrect) { 
            return res.status(400).json({ message: "Invalid Credentials" }); 
        }

        const token = generateToken(user._id, res);
        // res.cookie("JWT", token, { httpOnly: true, });
        res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
            },
            redirectUrl: `${process.env.CLIENT_URL}/`,
            token
        }); // Adjust the redirect URL as needed

    } catch (err) {
        console.log("Error in Login Controller: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = (req, res) => {
    try {
        // res.cookie("JWT", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout Succesful" });

    } catch (err) {
        console.log("Error in Logout Controller: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { displayName, profilePic } = req.body;
        const userId = req.user._id;

        // Create an object with the fields to update
        const updateFields = {};
        
        if (displayName) {
            updateFields.displayName = displayName;
        }
        
        if (profilePic) {
            updateFields.profilePic = profilePic;
        }
        
        // Only proceed if there are fields to update
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid update fields provided" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updateFields, 
            { new: true }
        ).select('-password');

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

        // res.cookie("JWT", token, { httpOnly: true, });
        // Redirect to your frontend dashboard or desired page
        // This small HTML triggers Electron's OAuth window to post success to main window
        res.send(`
            <html>
            <body>
                <script>
                window.opener?.postMessage({ type: "oauth-success" }, "*");
                window.close();
                </script>
                <p>Login successful. You can close this window.</p>
            </body>
            </html>
        `);

    } catch (err) {
        console.error("Error generating token or redirecting after OAuth:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.length < 3) {
            return res.status(400).json({ message: "Search query must be at least 3 characters" });
        }
        
        // Find users whose email or display name contains the search query
        // Exclude the current user from results
        const users = await User.find({
            $and: [
                { _id: { $ne: req.user._id } },
                {
                    $or: [
                        { email: { $regex: q, $options: 'i' } },
                        { displayName: { $regex: q, $options: 'i' } },
                        { fullName: { $regex: q, $options: 'i' } }
                    ]
                }
            ]
        }).select('_id email displayName fullName profilePic');
        
        // Limit to 10 results for performance
        res.status(200).json(users.slice(0, 10));
    } catch (err) {
        console.log("Error in searchUsers controller:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Get the uploaded file information
        const avatarFile = req.file;
        
        // In a real production app, you'd upload this to a cloud storage service
        // like AWS S3, Google Cloud Storage, etc. and get back a URL
        // For this example, we'll just use a placeholder approach
        
        // Example URL construction (in a real app, replace with actual cloud storage URL)
        const avatarUrl = `/uploads/avatars/${avatarFile.filename}`;
        
        // Update user with the new avatar URL
        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilePic: avatarUrl }, 
            { new: true }
        );
        
        res.status(200).json({
            message: "Avatar uploaded successfully",
            profilePic: avatarUrl
        });
    } catch (err) {
        console.log("Error in uploadAvatar:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};