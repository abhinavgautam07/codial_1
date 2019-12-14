const express = require('express');
const router = express.Router();
const passport = require('passport');
const friendship_controller = require('../controllers/friendship_controller');
const usersController = require('../controllers/users_controller');

//in line 7 the middleware is just checking that user is authenticated or not.
router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.get('/sign-out', usersController.destroySession);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.createUser);

//here the passport is authenticating the user i.e first uses the local strtaegy to authenticate
//in local strategy what it does that it first receives email in the usernameField and the password and then
//find the user. if error or password doesnot match occurs the failureRedirect is called using done(err) or 
//done(null,false). if the user is found it is sent to serializer which stores the user id in session cookie.
//after that passport-session data is sent to deserializer which sets the req.user(it contains all detais of
// autenticated user from the database).

//this whole process is done authenticating the user. that is why we need to login (or authenticate) again 
//if the cookie get expired as the authentication involves storing into cookies.

//Also during authentication process, passport puts a method isAuthenticated on the req in one of the middleware
//and once cookie gets expired the isAuthenticated is set to false  and req.user also gets removed.
//no need to name as local or google only can be named anything. it is just for counting all the strategies 
// and stops when any of the strategy succeds of fails
//passport.authenticate takes the `local` as name parameter and second parameter as options 
//then uses the name for identifying the strategy and then calls the authenticate function of tha strategy 
//passing the credentials in req.body
router.post('/create-session', passport.authenticate('local', { failureRedirect: '/users/sign-in' }), usersController.createSession);
//the scope is just asking the google to give access to profile and email of the user
//u might think we can email in profile as well as profile.emails[0].val so what is the need of
//email in scope but profile.emails[0].val will work only when email is used in scope as then only
//google will allow u to access someone's email
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/sign-in' }), usersController.createSession);
router.post('/toggleFriendship', passport.checkAuthentication, friendship_controller.toggleFriendship);
module.exports = router;