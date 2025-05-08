import express from "express";
import multer from "multer";
import path from "path";
import { 
    signup, 
    login, 
    logout, 
    updateProfile, 
    checkAuth,
    handleOAuthCallback,
    searchUsers,
    uploadAvatar
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.protectRoute.js";
import passport from "passport";

const router = express.Router();

// Configure multer storage for avatar uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/avatars/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'avatar-' + uniqueSuffix + ext);
    }
});

// File filter for avatar uploads
const fileFilter = (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB max file size
    },
    fileFilter: fileFilter
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);  // Updated route to match client request
router.post("/upload-avatar", protectRoute, upload.single('avatar'), uploadAvatar);
router.get("/checkAuth", protectRoute, checkAuth);
router.get("/search", protectRoute, searchUsers);

// --- Google Auth Routes ---
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
    // Authenticate via Passport first
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login-failed?provider=google`,
        session: false // Ensure session is false for JWT
    }),
    (req, res, next) => {
        console.log("Google OAuth Callback Hit");
        console.log("Authenticated User:", req.user); // Log the user object
        next();
    },
    // If authentication succeeds, call the controller function
    handleOAuthCallback
);

// --- Discord Auth Routes ---
router.get('/discord',
    passport.authenticate('discord', { scope: ['identify', 'email'], session: false })
);

router.get('/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: `${process.env.CLIENT_URL}/login-failed?provider=discord`,
        session: false
    }),
    handleOAuthCallback // Processes OAuth tokens and creates or updates user sessions
);

// --- GitHub Auth Routes ---
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.CLIENT_URL}/login-failed?provider=github`,
        session: false
    }),
    handleOAuthCallback // Use the controller function
);

export default router;