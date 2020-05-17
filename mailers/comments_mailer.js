const nodemailer=require('../config/nodemailer');
// newComment=function...
// module.exports=newComment
// instead of this we can write as this also
exports.newComment=(comment)=>{
  let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
  // console.log(typeof(htmlString));
//send mail is a predefined function
nodemailer.transporter.sendMail({
  from:'abhhinavgautam36@gmail.com',
  to: comment.user.email,
  subject:'new comment published',
  html: htmlString
},(err,info)=>{
  if(err){
    console.log('error in sending mail',err);
    return;
  }
  return;
});
}