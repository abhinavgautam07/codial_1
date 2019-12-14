const mongoose =require('mongoose');

const FriendshipSchema=new mongoose.Schema({
  from_user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required:true
  },
  to_user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required:true
  }
},{
  timestamps:true
});

const Friendship=mongoose.model('Friendship',FriendshipSchema);
module.exports=Friendship;