const passport = require('passport');
const env = require('./environment');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users_schema');
//tell passport to use new strategy for google auth
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },
    function(accessToken, refreshToken, profile, done) {

        //profile contains user information
        //find a user
        User.findOne({ email: profile.emails[0].value }).exec(function(err, user) {
            if (err) {
                console.log(err, "error in gooogle");
                return;
            }
            console.log(profile);
            if (user) {
                //if found ,set it as req.user
                return done(null, user);
            } else {
                // else create the user and set req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, newUser) {
                    if (err) {
                        console.log(err, "error in creating the user");
                        return;
                    }
                    return done(null, newUser);

                });
            }
        });
    }
));
module.exports = passport;