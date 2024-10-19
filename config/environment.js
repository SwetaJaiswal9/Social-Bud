const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory
});

const development = {
  name: "development",
  asset_path: process.env.DEV_SOCIALBUD_ASSET_PATH,
  session_cookie_key: process.env.DEV_SOCIALBUD_SESSION_COOKIE_KEY,
  db: process.env.DEV_SOCIALBUD_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.DEV_SOCIALBUD_GMAIL_USERNAME,
      pass: process.env.DEV_SOCIALBUD_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.DEV_SOCIALBUD_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.DEV_SOCIALBUD_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.DEV_SOCIALBUD_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.DEV_SOCIALBUD_JWT_SECRET,
  morgan: {
    mode: 'dev',
    options:{stream: accessLogStream}
  }
};



const production = {
  name: "production",
  asset_path: process.env.SOCIALBUD_ASSET_PATH,
  session_cookie_key: process.env.SOCIALBUD_SESSION_COOKIE_KEY,
  db: process.env.SOCIALBUD_DB,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SOCIALBUD_GMAIL_USERNAME,
      pass: process.env.SOCIALBUD_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.SOCIALBUD_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.SOCIALBUD_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.SOCIALBUD_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.SOCIALBUD_JWT_SECRET,
  morgan: {
    mode: 'combined',
    options:{stream: accessLogStream}
  }
};

// module.exports = eval(process.env.SOCIALBUD_ENVIRONMENT) == undefined ? development : eval(process.env.SOCIALBUD_ENVIRONMENT);
// module.exports = process.env.SOCIALBUD_ENVIRONMENT === "production" ? production : development;

module.exports = process.env.NODE_ENV === "production" ? production : development;
