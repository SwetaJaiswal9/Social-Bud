const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        } else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })
        console.log('Likeable ID:', likeable._id, typeof likeable._id); 
        console.log('Likeable Object:', likeable._id, 'Existing Like:', existingLike);

        if(existingLike){
            likeable.likes.pull(existingLike._id);
            console.log('Likeable ID:', likeable._id, typeof likeable._id); 
            console.log('Like removed. Updated likes:', likeable.likes);
            await likeable.save();

            existingLike.deleteOne();
            deleted = true;
        } else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });
            console.log('New like created:', newLike); 
            likeable.likes.push(newLike._id);
            console.log('Like added. Updated likes:', likeable.likes); 
            await likeable.save();
        }

        return res.json(200, {
            message: "Request Successful!",
            data:{
                deleted: deleted
            }
        })

    } catch(err){
        console.log(err);
        return res.json(500, {
            message: "internal Server Error"
        });
    }
} 