const Comment = require('../models/comments');
const Post = require('../models/post_schema');
const User = require('../models/users_schema');
const CommentsMailer=require('../mailers/comments_mailer');
module.exports.create = async function (req, res) {
  try {

    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post, //or post._id
        user: req.user._id
      });


      
      post.comments.push(comment._id);
      post.save();
      await comment.populate('user', 'name email').execPopulate();
        CommentsMailer.newComment(comment);
      if (req.xhr) {
     
        
        return res.status(200).json({
          data: {
            comment: comment
          },
          message: "comment added!"
        });
      }
      return res.redirect('/');

    }
  } catch (err) {
    console.log('Error', err);
    return;

  }


}
module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    let postId = comment.post;

    let post = await Post.findById(postId);
    let userId = post.user;
    if (comment.user == req.user.id || req.user.id == userId) {

      await comment.remove();
      await post.update(postId, { $pull: { comments: req.params.id } });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment
          }, message: "comment deleted"
        });
      }
      return res.redirect('back');

    } else {
      return res.redirect('back');
    }


  } catch (err) {
    console.log('Error', err);
    return;
  }








}
