const { blankFieldErrorMessage } = require('../constants/strings');
const UserVideo = require('../models/userVideoModel');

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

        const newUserVideo = new UserVideo({
            userId: userInfo._id,
            videoId,
            watchTime,
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
        isUserVideo.watchTime = Number(isUserVideo.watchTime) + Number(watchTime);
        isUserVideo.duration = Number(isUserVideo.duration) + Number(duration);
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