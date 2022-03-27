const { blankFieldErrorMessage } = require('../constants/strings');
const Video = require('../models/videoModels');

const addVideo = async(req,res) => {

    const {videoTitle, videoURL, videoTags, linkToProduct} = req.body;

    if(!videoTitle || !videoURL){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    const newVideo = await new Video({
        videoTitle,
        videoTags,
        videoURL,
        linkToProduct,
    });

    newVideo.save()
        .then(
            res.json({success:true})
        ).catch((err)=> 
            res.json({success:false,message:err})
        );
}

const likeVideo = async(req,res) => {
    
    const userInfo = req.user;
    const {videoId} = req.body;


    Video.findByIdAndUpdate({_id:videoId},
        {
            $push: {likes:userInfo._id}}
    )
        .then(() => {
            res.json({
                success:true,
                message: 'video liked successfully'
            })
        })
        .catch((err) => {
            res.json({success:false, message:err})
        });
}

const unlikeVideo = async(req,res) => {
    
    const userInfo = req.user;
    const {videoId} = req.body;


    Video.findByIdAndUpdate({_id:videoId},
        {
            $pull: {likes:userInfo._id}}
    )
        .then(() => {
            res.json({
                success:true,
                message: 'video unliked successfully'
            })
        })
        .catch((err) => {
            res.json({success:false, message:err})
        });
}

module.exports = {addVideo, likeVideo, unlikeVideo};
