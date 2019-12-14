const nodemailer=require('../config/nodemailer');
// newComment=function...
// module.exports=newComment
// instead of this we can write as this also
exports.newComment=(comment)=>{
  let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment');
console.log("inside new Comment mailer",comment);
//send mail is a predefined function
nodemailer.transporter.sendMail({
  from:'abhinavgautam36@gmail.com',
  to: comment.user.email,
  subject:'new comment published',
  html: htmlString
},(err,info)=>{
  if(err){
    console.log('error in sending mail',err);
    return;
  }
  console.log('mail delivered' ,info);
  return;
});
}