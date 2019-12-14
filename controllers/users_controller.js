const User = require('../models/users_schema');
const Post = require('../models/post_schema');
const mongoose = require('mongoose');
const Friendship = require('../models/friendship');
const fs = require('fs');
const path = require('path');
module.exports.signIn = function(req, res) {

    if (req.isAuthenticated()) {

        return res.redirect('/users/profile')
    }
    return res.render('sign_in', {
        title: "signIn"
    });
}

module.exports.signUp = function(req, res) {
    //isAuthenticated is global as req is global passport just adds the property isAuthenticated to it
    if (req.isAuthenticated()) {

        res.redirect('/users/profile');
    }
    return res.render('sign_up', {
        title: "signUp"
    });
}

module.exports.createUser = async function(req, res) {
    try {

        await User.uploadedAvatar(req, res, async function(err) {
            if (err) {
                console.log("multer error", err);
            }
            if (req.body.password != req.body.confirm_password) {
                return res.redirect('back');
            }

            let user = await User.findOne({ email: req.body.email });


            if (!user) {
                let newUser = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                if (req.file) {
                    newUser.avatar = User.avatarPath + '/' + req.file.filename;
                }
                newUser.save();

                return res.redirect('/users/sign-in');


            } else {
                return res.redirect('back');
            }


        });

    } catch (error) {

        console.log(error);

        return res.redirect('back');
    }






}
module.exports.profile = async function(req, res) {
    try {
        let profile_user = await User.findById(req.params.id);
        let already_friend = false;
        let type1 = await Friendship.find({
            to_user: req.params.id,
            from_user: req.user._id
        });


        let type2 = await Friendship.find({
            to_user: req.user._id,
            from_user: req.params.id
        });

        if (type1.length != 0 || type2.length != 0) {
            already_friend = true;
        }

        return res.render('profile', {
            title: 'profile | codial',
            already_friend: already_friend,
            profile_user: profile_user
        });
    } catch (err) {
        console.log(err);
        return;
    }

}
module.exports.createSession = function(req, res) {
    req.flash('success', 'logged in successfully');
    //here we are setting the key value pairs as success being the key and value being the logged in successfully
    return res.redirect('/');
}



module.exports.destroySession = function(req, res) {
    req.logout();
    req.flash('success', 'logged out');
    return res.redirect('/');
}
module.exports.update = async function(req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            //we wont be able to get req.body as usual as body parser is not able to parse multipart form
            //so multer makes a way for us

            // as uploadedAvatar calls multer
            //multer gets the form data through uploadedAvatar function and parses it  send the file to the destination and filename
            await User.uploadedAvatar(req, res, function(err) {
                if (err) {
                    console.log('*********multer error', err);
                }

                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {

                    if (user.avatar) { //checking that if the user has already an avatar

                        // we also need to check that the file we are deleting even exists or not
                        //this check is neceesary as we may by mistake want to delete a file a which dont exist
                        //this will throw an error

                        if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {

                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));

                        }
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                    console.log(user.avatar);
                }
                user.save();
                return res.redirect('back');
            });

        } catch (err) {
            console.log('*******error in multer', err);
            return res.redirect('back');
        }
    } else {
        return res.status(401).send('unauthorized');
    }

}