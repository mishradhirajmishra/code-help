const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./key');
const User = require('../model/User');


passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});
passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clintID,
        clientSecret: keys.google.clintSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleID: profile.id }).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser);
            } else {
                new User({
                    googleID: profile.id,
                    name: profile.displayName,
                    image: profile._json.picture,
                    provider: 'google'
                })
                    .save().then((newUser) => {
                        done(null, newUser);
                    })
            }
        })


    })
);