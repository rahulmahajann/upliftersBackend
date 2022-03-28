const { blankFieldErrorMessage } = require('../constants/strings');
const Video = require('../models/videoModels');
const Product = require('../models/productModel');

const addVideo = async(req,res) => {

    const {videoTitle, videoURL, videoTags, relatedProduct} = req.body;

    if(!videoTitle || !videoURL){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    if(relatedProduct){
        const checkLink = await Product.findOne({_id:relatedProduct});
        if(!checkLink){
            return res.json({
                success:false,
                message : "invalid link"
            })
        }
    }


    const newVideo = await new Video({
        videoTitle,
        videoTags,
        videoURL,
        relatedProduct,
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

    const videoInfo = await Video.findById({
        _id: videoId
    })

    const likesArr = videoInfo.likes;

    // console.log(likesArr);

    if(likesArr.includes(userInfo._id)){
        try{
            await Video.findByIdAndUpdate({_id : videoId}, {
                $pull: {likes: userInfo._id}
            })
            return res.json({
                success: true,
                message: 'unliked'
            })
        }catch(err){
            return res.json({
                success: false,
                message: err
            })
        }
    }else{
        try{
            await Video.findByIdAndUpdate({_id : videoId}, {
                $push: {likes: userInfo._id}
            })
            return res.json({
                success: true,
                message: 'liked'
            })
        }catch(err){
            return res.json({
                success: false,
                message: err
            })
        }
    }

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
