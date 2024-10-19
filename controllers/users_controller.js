const User = require("../models/user");
const fs = require('fs');
const path = require('path');

module.exports.profile = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.redirect(req.get("Referrer") || "/");
    }
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  } catch (err) {
    console.log("Error fetching user profile:", err);
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.update = async function (req, res) {
  try {
    if (req.user.id == req.params.id) {
      // let user = await User.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      // });
      // if (user) {
      //   return res.redirect(req.get("Referrer") || "/");
      // } else {
      //   return res.status(404).send("User not found");
      // }

      let user = await User.findByIdAndUpdate(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) {
          console.log("Multer Error: ", err);
        }
        console.log(req.file);

        user.name = req.body.name;
        user.email = req.body.email;

        if(req.file){
          if(user.avatar){
            fs.unlinkSync(path.join(__dirname, '..', user.avatar))
          }

          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect(req.get("Referrer") || "/");
      });
      
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log("Error updating profile:", err);
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile/");
  }
  return res.render("user_sign_up", {
    title: "Social Bud | Sign Up",
  });
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile/");
  }
  return res.render("user_sign_in", {
    title: "Social Bud | Sign In",
  });
};

module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash('error', 'Passwords do not match');
    return res.redirect(req.get("Referrer") || "/");
  }

  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      user = await User.create(req.body);
      return res.redirect("/users/sign-in");
    } else {
      req.flash('success', 'You have signed up, login to continue!');
      return res.redirect(req.get("Referrer") || "/");
    }
  } catch (err) {
    console.log("Error during signup:", err);
    return;
  }
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully!");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.log("Error logging out:", err);
      return next(err);
    }
    req.flash("success", "You have logged out!");
    return res.redirect("/");
  });
};
