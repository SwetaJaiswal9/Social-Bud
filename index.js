require('dotenv').config();
const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");
const CookieParser = require("cookie-parser");
const app = express();
require("./config/view-helpers")(app);
const cors = require("cors");
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const MongoStore = require("connect-mongo");
const path = require("path");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port 5000");

app.use(
  cors({
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

if (env.name == "development") {
  app.use(express.static(path.join(__dirname, env.asset_path)));
} else if (env.name == "production") {
  app.use(express.static(path.join(__dirname, "public")));
}

app.use(express.urlencoded({ extended: false }));

app.use(CookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "social-bud",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/social_bud",
      autoRemove: "disabled",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server: ${err}`);
  } else {
    console.log(`Server is running on port: ${port}`);
  }
});
