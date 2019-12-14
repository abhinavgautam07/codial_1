const mongoose = require('mongoose');
//we are not requiring multer in config but in different files as along with some commmon configuration we want to set some configuration specific to that file so we are setting multer in different files not in config folder

//1st use of multer////////////////
// Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
///////////////////
const multer = require('multer');
const path = require('path')
const AVATAR_PATH = path.join('/uploads/users/avatars');
const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,

  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  friendship:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Friendship'
    }
  ]
}, {
  timestamps: true
});
//for ensuring that password is not show in api request
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }
// __dirname wil give F/nodews/codial/models and joining .. will return F/nodews/codial as path.join return a normalized path i.e. it resolves the .. and / according to there meaning

/////////////////////////////2nd use of multer////////////////////

// The disk storage engine gives you full control on storing files to disk.
let storage = multer.diskStorage({
  
  // destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system's default directory for temporary files is used.

 ////////// Note: You are responsible for creating the directory when providing destination as a function. When passing a string, multer will make sure that the directory is created for you.///////////

//  filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.

// the cb does the assigned tasks as in destination it detemines the destination
// and in filename it works with saving the file in the localStorage
  destination: function (req, file, cb) { //cb is the callback func like done()
    console.log('beeeeeeeee');
    cb(null, path.join(__dirname,'..',AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
// multer(opts)
// Multer accepts an options object, the most basic of which is the {dest} property, which tells Multer where to upload the files. In case you omit the options object, the files will be kept in memory and never written to disk.
// Key             :Description
// dest or storage:	Where to store the files
////////use of .single('fieldname')
// Accept a single file with the name fieldname. from the form. The single file will be stored in req.file.

userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');
userSchema.statics.avatarPath=AVATAR_PATH;
//we are using avatarPath as we want that AVATAR_PATH should be available publicly with model-name
const Users = mongoose.model('Users', userSchema);
module.exports = Users;