const Post=require('../../../models/post_schema');
const Comment=require('../../../models/comments');
const fs=require('fs');
const path=require('path');
module.exports.index= async (req,res)=>{
  let posts = await Post.find({})
  .sort('-createdAt')
  .populate('user')
  .populate({
    path: 'comments',
    populate: {
      path: 'user'
    }
  });
  return res.json(200,{
    message: "list of posts",
    posts:posts
  })
}

module.exports.destroy = async function (req, res) {

  try {
    let post = await Post.findById(req.params.id);
    console.log(post);
    //check if the it is the same user who has created the post is deleting it(line 29)
    //post.user is id of the user who has created the post refer to post schema  type is objectId
    // when we are comparing two ids we need to convert them to strings ,mongoose provide a way
    //ideally it should be req.user._id  but mongoose provide a way to convert it to string by doing req.user.id
    // if (post.user == req.user.id) {
      //post.remove works on the object and Post.delete works on the collection name
     if(post.user==req.user.id){
      post.remove();
      
      if (post.image && fs.existsSync(path.join(__dirname, '..','..','..', post.image))) {
      
        fs.unlinkSync(path.join(__dirname, '..','..','..', post.image));

      }
      
      await Comment.deleteMany({ post: req.params.id });
      // if (req.xhr) {
      //   return res.status(200).json({
      //     data: {
      //       post_id: req.params.id
      //     },
      //     message: "post deleted!"
      //   });
      // }
      return res.json(200,{
        message:"post and associated comments deleted"
      });
     }
    

    // }

    else {
      return res.json(401,{
        message:"you cant delete this post"
      });
    }


  } catch (err) {
  console.log(err);
    return res.json(500,{
      messsage:"internal server error"
    });

  }

}