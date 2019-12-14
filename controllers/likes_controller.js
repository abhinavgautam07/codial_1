const Like=require('../models/likes');
const Comment=require('../models/comments');
const Post=require('../models/post_schema');

module.exports.toggleLike= async function(req,res){
  //url will be 
try{
  console.log(req.query);
  let likeable;
  let deleted=false;
  //here likable will contain the post or comment on which like request has been made
  if(req.query.Type=='Post'){
    likeable=await Post.findById(req.query.id).populate('likes');
    
  }else{
    likeable=await Comment.findById(req.query.id).populate('likes');
  }
    let exsistingLike=await Like.findOne({
      user:req.user._id,
      likeable:req.query.id,
      onModel:req.query.Type
    });
    if(exsistingLike){
      deleted=true;
      likeable.likes.pull(exsistingLike._id);
      likeable.save();
      exsistingLike.remove();
    }else{
    let newLike= await Like.create({
        user:req.user._id,
        likeable:req.query.id,
        onModel:req.query.Type
      });
      likeable.likes.push(newLike._id);
      likeable.save();
    }
    return res.json(200,{
      message:`you liked a ${req.query.Type}`,
      data:{
        deleted:deleted,
        likeable_id:req.query.id,
        type:req.query.Type
      }
    });
    

}catch(err){
  console.log(err);
  return res.json(500,{
    message:'internal Server Error'
  });
}
  

}