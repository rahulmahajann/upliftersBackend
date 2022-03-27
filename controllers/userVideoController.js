const { blankFieldErrorMessage } = require('../constants/strings');
const UserVideo = require('../models/userVideoModel');
const Video = require('../models/videoModels');

const setWatchTime = async (req, res) => {
    const userInfo = req.user;

    const {videoId, watchTime} = req.body;

    if(!videoId || !watchTime){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    const isUserVideo = await UserVideo.findOne({
        userId: userInfo._id,
        videoId
    });

    if(!isUserVideo){

        const videoInfo = await Video.findOne({
            _id: videoId
        });

        const likeArr = videoInfo.likes;

        var liked = false

        if(likeArr.includes(userInfo._id)){
            liked = true
        }else{
            liked = false
        }

        const newUserVideo = new UserVideo({
            userId: userInfo._id,
            videoId,
            watchTime,
            liked
        })
        
        newUserVideo.save()
            .then(() => {
                return res.json({
                    success: true,
                    message: 'watch time saved'
                })
            }).catch((err) => {
                return res.json({
                    success: false,
                    message: err
                })
            })
    }else{
        const maxWatchTime = Math.max(watchTime, isUserVideo.watchTime);
        const videoInfo = await Video.findOne({
            _id: videoId
        });

        const likeArr = videoInfo.likes;
        var liked = false
        if(likeArr.includes(userInfo._id)){
            liked = true
        }else{
            liked = false
        }
        isUserVideo.watchTime = maxWatchTime;
        isUserVideo.liked = liked;
        isUserVideo.save()
            .then(() => {
                return res.json({
                    success: true,
                    message: 'watch time updated'
                })
            }).catch((err) => {
                return res.json({
                    success: false,
                    message: error
                })
            })

    }
}

module.exports = {setWatchTime};