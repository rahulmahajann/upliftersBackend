const { blankFieldErrorMessage } = require('../constants/strings');
const UserVideo = require('../models/userVideoModel');
const Video = require('../models/videoModels');

const setWatchTime = async (req, res) => {
    const userInfo = req.user;

    const {videoId, watchTime, duration} = req.body;

    if(!videoId || !watchTime || !duration){
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
            liked,
            duration
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

        const videoInfo = await Video.findOne({
            _id: videoId
        });


        const likeArr = videoInfo.likes;
        var like = false
        if(likeArr.includes(userInfo._id)){
            console.log(likeArr.includes(userInfo._id), 'yha se?');
            like = true
        }else{
            console.log(likeArr.includes(userInfo._id), 'nhi yha se!');
            like = false
        }
        isUserVideo.watchTime = Number(isUserVideo.watchTime) + Number(watchTime);
        isUserVideo.duration = Number(isUserVideo.duration) + Number(duration);
        isUserVideo.liked = like;
        isUserVideo.save()
            .then(() => {
                return res.json({
                    success: true,
                    message: 'watch time updated'
                })
            }).catch((err) => {
                return res.json({
                    success: false,
                    message: err
                })
            })

    }
}

module.exports = {setWatchTime};