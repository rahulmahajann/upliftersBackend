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

    newVideo.save().then(res.json({success:true})).catch((err)=> res.json(err));
}

module.exports = {addVideo};