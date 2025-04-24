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
router.get("/check", protectRoute, checkAuth);

// --- Google Auth Routes ---
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
    // Authenticate via Passport first
    passport.authenticate('google', {
        failureRedirect: `${CLIENT_URL}/login-failed?provider=google`,
        session: false // Ensure session is false for JWT
    }),
    // If authentication succeeds, call the controller function
    handleOAuthCallback
);

// --- Discord Auth Routes ---
router.get('/discord',
    passport.authenticate('discord', { scope: ['identify', 'email'], session: false })
);

router.get('/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: `${CLIENT_URL}/login-failed?provider=discord`,
        session: false
    }),
    handleOAuthCallback // Use the controller function
);

// --- GitHub Auth Routes ---
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${CLIENT_URL}/login-failed?provider=github`,
        session: false
    }),
    handleOAuthCallback // Use the controller function
);

export default router;