const Post = require('../models/post_schema');
const mongoose = require('mongoose');
const passport = require('passport');
const Friendship = require('../models/friendship');
const User = require('../models/users_schema');
module.exports.home = async function (req, res) {
  // console.log(req.cookies);
  // res.cookie('user_id', 25);

  // Post.find({}, function(err, posts){
  //     return res.render('home', {
  //         title: "Codeial | Home",
  //         posts:  posts
  //     });
  // });

  // populate the user of each post
  // Post.find({}).populate('user').exec(function (err, posts) {
  //   return res.render('home',{
  //       title:"codial | home",
  //       posts:posts
  //   });

  // });
  //populating comment as well
  try {
    let friends=new Array();
    if (req.user) {
      let f= await Friendship.find({});
      let signed_in_user = await User.findById(req.user._id)
        .populate({
          path: 'friendship',
          populate: {
            path: 'from_user'
          }
        })
        .populate({
          path:'friendship',
          populate :{
            path: 'to_user'
          }
        });
        let friendships=signed_in_user.friendship;
        for(f of friendships){
          if(f.from_user.id!=signed_in_user.id){
            friends.push(f.from_user);
          }else{
            friends.push(f.to_user);
          }
        }
    }


    let posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      });



    let users = await User.find({});

    return res.render('home', {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
      friends: friends                      //here friends are the friends of the current signed in user(if signed                                         in,otherwise friends is undefined ).if no friends it will be an empty                                        array                               
    });





  } catch (err) {

    console.log('Error', err);
    return res.redirect('back');
  }

}

// module.exports.actionName = function(req, res){}