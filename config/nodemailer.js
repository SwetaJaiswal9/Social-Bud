const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require('./environment');

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = async (data, relativePath) => {
  try {
    let mailHTML = await ejs.renderFile(
      path.join(__dirname, "../views/mailers", relativePath),
      data
    );

    return mailHTML;
  } catch (err) {
    console.error("Error in rendering template", err);
    throw new Error("Template rendering failed");
  }
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
