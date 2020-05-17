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
  // Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
  // fieldname:Field name specified in the form
  // filename:The name of the file within the destination 
//   .single(fieldname)
// Accept a single file with the name fieldname. The single file will be stored in req.file.	
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