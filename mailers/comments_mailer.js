const nodeMailer = require("../config/nodemailer");

exports.newComment = async (comment) => {
  try {
    // console.log("Inside new comment mailer");

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');


    let info = await nodeMailer.transporter.sendMail({
      from: "swetajaiswalcs@gmail.com",
      to: comment.user.email,
      subject: "New comment published!",
      html: htmlString,
    });

    // console.log("Message sent successfully", info);
  } catch (err) {
    console.log("Error in sending mail", err);
  }
};
