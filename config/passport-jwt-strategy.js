const passport = require('passport');
const env = require('./environment');
const JWTStrategy = require('passport-jwt').Strategy; //importing the strategy
const ExtractJWT = require('passport-jwt').ExtractJwt //this we are importing a module that will help in extractiong JWT from header
const User = require('../models/users_schema');
//this is not like local strategy.in local strategy the cookies are created by the passport in the background 
//here we will ourself create a token using the library `jsonwebtoken`
//here we just extracting the user details from the already created token(which was created at the time of login) and matching in the database that this token is valid or not..we can think of it like the function checkAuthentication
//it is not logging in the user just matching the already created token
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