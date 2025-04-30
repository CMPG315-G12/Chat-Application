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
        email = profile.emails[0].value;
    } else if (provider === 'discord' && profile.email) {
        email = profile.email;
    } else if (provider === 'github' && profile.emails && profile.emails.length > 0) {
        email = profile.emails.find(e => e.primary)?.value || profile.emails[0].value;
    }

    if (!email) {
        console.warn(`Email not provided by ${provider} for profile ID: ${profile.id}`);

       throw new Error(`Email not provided by ${provider}. Cannot create or link user.`);
    }

    try {
        //find user by provider id
        let user = await User.findOne({ email });

        //User found by providerId
        if (user) {
            // Check if the provider is already linked
            const existingProvider = user.providers.find(
                (p) => p.provider === provider && p.providerId === profile.id
            );

            if (!existingProvider) {
                // Add the new provider to the providers array
                user.providers.push({ provider, providerId: profile.id });
                await user.save();
                console.log(`Linked ${provider} to existing user: ${email}`);
            }

            return user;
        } else { 
            // No user found by provider ID - Create new user
            console.log(`Creating new ${provider} user: ${email}`);
            user = await User.create({
                email: email.toLowerCase(),
                fullName: profile.displayName || profile.username || email.split('@')[0],
                displayName: profile.displayName || profile.username || email.split('@')[0],
                providers: [{ provider, providerId: profile.id }],
                profilePic: (profile.photos && profile.photos[0]?.value) ||
                    (provider === 'discord' && profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : '') ||
                    '',
            });
            
            return user;
        }

    } catch (err) {
        console.error(`Error in findOrCreateUser for ${provider}:`, err);
       throw err; // Let the error propagate to the Passport callback
    }
};

// --- Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
},
    async (accessToken, refreshToken, profile, done) => {
        console.log("Google Strategy Callback Invoked");
        console.log("Google Profile:", profile);

        try {
            // Simulate finding or creating a user
            const user = await findOrCreateUser(profile, 'google');
            done(null, user);
        } catch (err) {
            console.error("Error in Google Strategy:", err);
            done(err, null); // Call done with an error
        }
    }

));

// --- Discord Strategy ---
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
},
    async (accessToken, refreshToken, profile, done) => {
        console.log("Discord Strategy Callback Invoked");
        console.log("Discord Profile:", profile);

        try {
            // Simulate finding or creating a user
            const user = await findOrCreateUser(profile, 'discord');
            console.log("User Found or Created:", user);

            // Call done with the user object
            done(null, user);
        } catch (err) {
            console.error("Error in Discord Strategy:", err);
            done(err, null); // Pass the error to Passport
        }
    }
));

// --- GitHub Strategy ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
},
    async (accessToken, refreshToken, profile, done) => {
        console.log("GitHub Strategy Callback Invoked");
        console.log("GitHub Profile:", profile);

        try {
            // Simulate finding or creating a user
            const user = await findOrCreateUser(profile, 'github');
            console.log("User Found or Created:", user);

            // Call done with the user object
            done(null, user);
        } catch (err) {
            console.error("Error in GitHub Strategy:", err);
            done(err, null); // Pass the error to Passport
        }
    }
));

export default passport;