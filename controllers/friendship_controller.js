const Friendship=require('../models/friendship');
const User=require('../models/users_schema');

module.exports.toggleFriendship=async function(req,res){
try{
   
  let removed=false;
let user1=await User.findById(req.user._id);
let user2=await User.findById(req.body.id);
console.log(user1.id==user2.id);
let already_sent=await Friendship.findOne({
  from_user:user1._id,
  to_user:user2._id
});
let already_received=await Friendship.findOne({
  from_user:user2._id,
  to_user:user1._id
});
if(already_sent){
user1.friendship.pull(already_sent._id);
user2.friendship.pull(already_sent._id);
user1.save();
user2.save();
already_sent.remove();
removed=true;


}else if(already_received){
  user1.friendship.pull(already_received._id);
  user2.friendship.pull(already_received._id);
  user1.save();
  user2.save();
  already_received.remove();
  
  removed=true;
}else{
 console.log('newly sent');
  let newFriendship=await Friendship.create({
    from_user:user1._id,
    to_user:user2._id
  });
  user1.friendship.push(newFriendship._id);
  user2.friendship.push(newFriendship._id);
  user1.save();
  user2.save();
}
return res.status(200).json({
  message:"friendship toggled",
  data:{
    deleted:removed
  }
});
}catch(err){
  console.log(err);
  return res.status(500).json({
    message:"internal server error"
  })
}

}