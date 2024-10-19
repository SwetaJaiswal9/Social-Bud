const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require('../models/like');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if(req.xhr){
      post = await post.populate('user', 'name');
      console.log(req.xhr);
      console.log('post',post);
      return res.status(200).json({
        data: {
          post: post
        },
        message: "Post created!"
      })
    }
    
    req.flash("success", "Post published!");
    return res.redirect(req.get("Referrer") || "/");

  } catch (err) {
    req.flash("error", err);
    // console.log("Error in creating a post", err);
    console.log(err);
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (post && post.user == req.user.id) {

      await Like.deleteMany({likeable: post, onModel: 'Post'});
      await Like.deleteMany({_id: {$in: post.comments}});

      await post.deleteOne();

      await Comment.deleteMany({ post: req.params.id });

      if(req.xhr){
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          }, 
          message: " Post deleted"
        });
      }
      
      req.flash("success", "Post and associated comments deleted!");
      return res.redirect(req.get("Referrer") || "/");
    } else {
      req.flash("error", "You cannot delete this post!");
      return res.redirect(req.get("Referrer") || "/");
    }
  } catch (err) {
    // console.log("Error in deleting post", err);
    req.flash("error", err);
    return res.redirect(req.get("Referrer") || "/");
  }
};
