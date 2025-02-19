const passport =require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy
require('dotenv').config()
passport.use(new googleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:3000/auth/google/callback',
    passReqToCallback : true

},
function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    done(null,profile)
  }
));

passport.serializeUser((user, done)=>{
    done(null, user)
})
passport.deserializeUser((obj, done)=>{
    done(null, obj)
})


