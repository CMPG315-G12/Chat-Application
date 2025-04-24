import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user.models.js';
import { generateToken } from './utils.js'; // Import your token generator

import dotenv from "dotenv";
dotenv.config();

//Unified User Data Handeling
const findOrCreateUser = async (profile, provider, done) => {
    console.log(`${provider} Profile: `, profile);

    let email = null;
    if (provider === 'google' && profile.emails && profile.emails[0]) {
        email = provider.emails[0].value;
    } else if (provider === 'discord' && profile.email) {
        email = profile.email;
    } else if (provider === 'github' && profile.emails && profile.emails.length > 0) {
        email = profile.find(e => e.primary)?.value || profile.emails[0].value;
    }

    if (!email) {
        console.warn(`Email not provided by ${provider} for profile ID: ${profile.id}`);

        return done(new Error(`Email not provided by ${provider}. Cannot create or link user.`), null);
    }

    const userData = {
        providerId: profile.id,
        provider: provider,
        displayName: profile.displayName || profile.username || profile.global_name || `User_${profile.id.substring(0, 8)}`,
        email: email.toLowerCase(), // Store emails consistently
        fullName: profile.displayName || profile.username || email.split('@')[0], // TODO: Provide a sensible default
        profilePic: (profile.photos && profile.photos[0]?.value) ||
            (provider === 'discord' && profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : '') ||
            '',
    };

    try {
        //find user by provider id
        const user = await User.findOne({ provider: provider, providerId: providerId });

        //User found by providerId
        if (user) {
            return (null, user);
        }

        user = await User.findOne({ email: userData.email });

        //User with email exists       
        if (user) {
            if (!user.provider) {
                console.log(`Linking ${provider} to existing email user: ${user.email}`);

                user.provider = provider;
                user.providerId = providerId;

                //TODO: Change Image?

                await user.save();
                return done(null, user);
            } else {
                // User exists but with a *different* provider or already linked.
                // TODO: Expand collition handling

                console.error(`User with email ${userData.email} already exists with provider ${user.provider}.`);
                return done(new Error(`Account conflict: Email ${userData.email} is already associated with another login method.`), null);
            }
        } else {
            // No user found by provider ID or email - Create new user
            console.log(`Creating new ${provider} user: ${userData.email}`);
            user = await User.create(userData);
            return done(null, user);
        }
    } catch (err) {
        console.error(`Error in findOrCreateUser for ${provider}:`, err);
        return done(err, null);
    }
};

// --- Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
},
    (accessToken, refreshToken, profile, done) => {
        findOrCreateUser(profile, 'google', done);
    }));

// --- Discord Strategy ---
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
},
    (accessToken, refreshToken, profile, done) => {
        findOrCreateUser(profile, 'discord', done);
    }));

// --- GitHub Strategy ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
},
    (accessToken, refreshToken, profile, done) => {
        findOrCreateUser(profile, 'github', done);
    }));

export default passport;