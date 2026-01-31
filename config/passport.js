// Passport Strategies
// Tutorial: https://www.youtube.com/watch?v=-RCnNyD0L-s (Passport.js Login System)
// Source: https://www.passportjs.org/docs/
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    // Serialize / Deserialize
    // Source: https://www.passportjs.org/docs/configure/
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    /*
     * Google Strategy
     * Source: https://www.passportjs.org/packages/passport-google-oauth20/
     * Logic: Verifies email domain (@iut-dhaka.edu) before creation.
     */
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            // Validation: Check if email is from iut-dhaka.edu
            const email = profile.emails[0].value;
            if (!email.endsWith('@iut-dhaka.edu')) {
                return done(null, false, { message: 'Access Denied: Please use your @iut-dhaka.edu email.' });
            }

            // Extract Student ID if present (9 digits)
            const idMatch = email.match(/\d{9}/);
            const studentId = idMatch ? idMatch[0] : undefined;

            const newUser = {
                googleId: profile.id,
                name: profile.displayName,
                email: email,
                avatar: profile.photos[0].value,
                studentId: studentId
            };

            try {
                let user = await User.findOne({ email: email });

                if (user) {
                    // Update Google ID and Student ID if missing
                    let updated = false;
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        updated = true;
                    }
                    if (!user.studentId && studentId) {
                        user.studentId = studentId;
                        updated = true;
                    }
                    if (updated) await user.save();

                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }));

    /**
     * GitHub Strategy
     * Source: https://www.passportjs.org/packages/passport-github2/
     */
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
        scope: ['user:email']
    },
        async (accessToken, refreshToken, profile, done) => {
            // Github emails can be private/multiple, need to handle carefully
            let email = null;
            if (profile.emails && profile.emails.length > 0) {
                email = profile.emails.find(e => e.primary || e.verified).value;
            }

            if (!email) {
                return done(null, false, { message: 'No public email found on GitHub account.' });
            }

            if (!email.endsWith('@iut-dhaka.edu')) {
                return done(null, false, { message: 'Access Denied: Please use your @iut-dhaka.edu email.' });
            }

            // Extract Student ID if present (9 digits)
            const idMatch = email.match(/\d{9}/);
            const studentId = idMatch ? idMatch[0] : undefined;

            const newUser = {
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email: email,
                avatar: profile.photos[0].value,
                studentId: studentId
            };

            try {
                let user = await User.findOne({ email: email });

                if (user) {
                    let updated = false;
                    if (!user.githubId) {
                        user.githubId = profile.id;
                        updated = true;
                    }
                    if (!user.studentId && studentId) {
                        user.studentId = studentId;
                        updated = true;
                    }
                    if (updated) await user.save();

                    done(null, user);
                } else {
                    user = await User.create(newUser);
                    done(null, user);
                }
            } catch (err) {
                console.error(err);
                done(err, null);
            }
        }));
};
