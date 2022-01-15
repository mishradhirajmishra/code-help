const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
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
    new TwitterStrategy({
        consumerKey: keys.twitter.consumerKey,
        consumerSecret: keys.twitter.consumerSecret,
        callbackURL: '/auth/twitter/callback',       
    }, (accessToken, refreshToken, profile, done) => {

        User.findOne({ twitterID: profile.id }).then((currentUser) => {
            if (currentUser) {
                done(null, currentUser);
            } else {
                new User({
                    twitterID: profile.id,
                    name: profile.displayName,    
                    image: profile.photos[0].value,                
                    provider: 'twitter'
                })
                    .save().then((newUser) => {
                        done(null, newUser);
                    })
            }
        })


    })
);