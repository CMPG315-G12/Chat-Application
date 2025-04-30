import express from "express";
import { 
    signup, 
    login, 
    logout, 
    updateProfile, 
    checkAuth,
    handleOAuthCallback
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.protectRoute.js";
import passport from "passport";

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL;

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update/profile", protectRoute, updateProfile);
router.get("/checkAuth", protectRoute, checkAuth);

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