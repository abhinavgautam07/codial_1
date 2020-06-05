const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/users_schema');
//localStrategy is not a object but a function //we are calling the function 
//named Strstegy in the file strategy.js in the node_modules of passport-local
//there u will see that the second argument is named as _verify
//so the second argument that we pass will be basically the definition of _verify
//but it is called in the .authenticate which is used as middleware in the users route
//there verified function is the done we are using here
//as u can see the post request passes the credentials submitted to the authenticate middleware,
//it then passes then to _verify as its arguments(function call of _verify)
// as soon as this file is chached in the index.js appropriate changes are made
//appropriate changes refer to the definfition of the _verify function that is Strategy function of the 
//strategy.js is called with the passed arguments.it acts as constructor function.

//it is necessary to set usernameField if different from `usename` as there is a lookup function that uses the 
//value in usernameField as key of the req.body to find the value of uername ,in this case as email.
passport.use(new localStrategy({
        usernameField: 'email'
    }, function(email, password, done) { //this function is _verify


        User.findOne({ email: email }, function(err, user) {
            if (err) {
                console.log('error in finding-->passport');
                return done(err);
            }
            if (!user || user.password != password) {
                console.log('invalid username or password');
                done(null, false);
            }

            return done(null, user);
            //from here done sends the control to the serealizer

        });

    }


));
// user returned by done is sent to serializer
//This function then calls done(null, user.id). Passport takes that
// user id and stores it internally on req.session.passport(i.e stores the user.id in 
//session cookie which is then encrypted using express-session) which is passport’s internal 
//mechanism to keep track of things.

passport.serializeUser(function(user, done) {
    console.log('serializer')
    return done(null, user.id);
});
//deselizer receives the  passport-session data, not directly the user id from serializer.
//serializer stores in passport session or session-cookie and then this session-cookie gets transferred to desializer 
// deserializeUser() then makes a request to our DB to find the full profile information for the user and then calls done(null, user).
//this done basically handovers the control to passport.session ,This is where the user profile is attached to the request handler as req.user. 
passport.deserializeUser(function(id, done) {
    console.log('deserializer')
    User.findById(id, function(err, user) {
        if (err) {
            console.log('error in finding-->passport');
            return done(err);
        }
        return done(null, user);
    });
});

//check if user is authenticated or not
passport.checkAuthentication = function(req, res, next) {
    console.log("Checking auth");
    //passport puts the method on request isAuthenticated(i.e.  this property is given to request by passport)
    //if the user is signed in pass on the request to the next function which is controller's action
    //isAuthenticated does is that whether session-cookie is present or not.
    if (req.isAuthenticated()) {
        return next();
    }
    //if the user is not signIn
    return res.redirect('/users/sign-in');

};


//set the user for the views
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        //whenever a user is signed in its information is available in req.user from deserialize user and 
        //.user property is given by the passport to the request but the it has not been given to response
       
        res.locals.user = req.user;
         res.locals.user.password=null;
        console.log("setting auth",res.locals.user.password);
    }
    return next();
};

module.exports = passport;