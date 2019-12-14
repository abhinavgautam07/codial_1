const passport = require('passport');
const env = require('./environment');
const JWTStrategy = require('passport-jwt').Strategy; //importing the strategy
const ExtractJWT = require('passport-jwt').ExtractJwt //this we are importing a module that will help in extractiong JWT from header
const User = require('../models/users_schema');
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret,

}
passport.use(new JWTStrategy(opts, async function(jwtPayLoad, done) {
    try {
        let user = await User.findById(jwtPayLoad._id);
        if (user) {
            return done(null, user);
        } else {
            console.log("expired")
            return done(null, false);
        }
    } catch (err) {
        console.log(err);
        return;
    }

}));