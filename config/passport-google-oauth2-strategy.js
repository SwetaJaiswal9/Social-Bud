const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const { error } = require("console");
const env = require('./environment');

passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_call_back_url,
    },

    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          console.log(profile);
          return done(null, user);
        } else {
            const user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            if (user){
                return done(null, user);
            } else{
                console.log("error in creating user", error);
                return done(null, false);
            }
        }
      } catch (err) {
        console.log("error in google strategy-passport", err);
        return done(err, false);
      }
    }
  )
);

module.exports = passport;