const queue = require('../config/kue');

const commentsMailer = require("../mailers/comments_mailer");

//every worker has a process function..process tells the 
//whenever new task is added to the queue..run the 
//function inside the process function

queue.process('emails', (job, done) => {

    // console.log("emails worker is processing a job", job.data);

    commentsMailer.newComment(job.data);
    done();
});