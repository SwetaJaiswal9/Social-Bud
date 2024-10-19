const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      await post.save();

      comment = await comment.populate("user", "name email");
      console.log(comment.user); 
      // commentsMailer.newComment(comment);
      let job = queue.create('emails', comment).save(function(err){
        if(err){
          console.log("Error creating a queue", err);
          return;
        }
        console.log("Job enqueued", job.id);
      })

      console.log(req.xhr);
      if (req.xhr) {
        console.log('XHR request detected'); 
        console.log('comment',comment);
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created!",
        });
      }

      req.flash("success", "Comment published!");
      res.redirect("/");
    }
  } catch (err) {
    console.log("Error in creating a comment", err);
    req.flash("error", "Error in creating comment");
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment && comment.user.equals(req.user.id)) {
      let postId = comment.post;
      await comment.deleteOne();

      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted",
        });
      }

      req.flash("success", "Comment deleted!");

      return res.redirect(req.get("Referrer") || "/");
    } else {
      req.flash("error", "Unauthorized");
      return res.redirect(req.get("Referrer") || "/");
    }
  } catch (err) {
    console.log("Error in deleting comment", err);
    req.flash("Error in deleting comment", err);
    return res.redirect(req.get("Referrer") || "/");
  }
};
