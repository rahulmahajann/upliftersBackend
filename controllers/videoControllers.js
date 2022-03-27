const Video = require('../models/videoModels');
const jwt = require('jsonwebtoken');



const addVideo = async(req,res) => {

    const {token} = req.headers;
    const {videoTitle, videoURL, videoTags, linkToProduct, likes} = req.body;

    const newVideo = await new Video({
        videoTitle,
        videoTags,
        videoURL,
        linkToProduct,
        likes
    });

    newVideo.save().then(res.json({success:true})).catch((err)=> res.json({success:false,message:err}));
}

const likeVideo = async(req,res) => {
    
    const {token} = req.headers;

    const {_id} = req.body;


    Video.findByIdAndUpdate(_id,{$push:{likes:user._id}}).then(res.json({success:true}))
    .catch(err => res.json({success:false, message:err}));
}

const unlikeVideo = async(res,res) => {

    const {token} = req.headers;

    const {_id} = req.body;


    Video.findByIdAndUpdate(_id,{$pull:{likes:user._id}}).then(res.json({success:true}))
    .catch(err => res.json({success:false, message:err}));

}

module.exports = {addVideo, likeVideo, unlikeVideo};
