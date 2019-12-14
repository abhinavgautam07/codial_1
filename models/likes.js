const mongoose=require('mongoose');
const LikeSchema=new mongoose.Schema({
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref:'Users',
  required:true,
},
//this defines objectId of the liked object
likeable:{
  type: mongoose.Schema.Types.ObjectId,
  refPath: 'onModel',
  required: true
},
// this defines the type of object that is getting liked
onModel :{
  type:String,
  enum:['Post','Comment']
}


},{
  timestamps:true
});

const Like=mongoose.model('Like',LikeSchema);
module.exports=Like;