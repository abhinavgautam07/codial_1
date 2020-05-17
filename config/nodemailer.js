const nodemailer = require('nodemailer');
const env = require('./environment');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    // console.log(data);
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),  //relative path is the path from where this function will be called
        data,  //the data that will be filled inside this template
        function(err, template) {
            if (err) {
                console.log(err, "error in rendering emails");
                return;
            }
            mailHTML = template;
        }
    );
    return mailHTML;
}
module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}