const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const IMAGE_PATH=path.join('/uploads/posts/post_images');
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true

  },//id of the user posting
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'

  },
  image:{
    type:String
  },

//include the ids of all comments on this post in an array
  comments:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }
  ],
  likes:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Like'
    }
  ]
}, {
    timestamps: true


  });

  const storage=multer.diskStorage({
    destination:function (req,file,cb){
      cb(null, path.join(__dirname,'..',IMAGE_PATH));
    },
    filename:function (req,file,cb){
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
postSchema.statics.postImage=multer({storage:storage}).single('post-image');
postSchema.statics.imagePath=IMAGE_PATH;
const Post = mongoose.model('Post', postSchema);
module.exports = Post;