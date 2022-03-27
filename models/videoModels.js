const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
        videoTitle:{
            type:String,
            required:true,
        },

        videoTags:{
            type:Array,
        },

        videoURL:{
            type:String,
            required:true,
        },

        linkToProduct:{
            type:String,
        },

        likes:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    },

    {
        timestamps:true,
    }

);

const Video = mongoose.model('Video',videoSchema);
module.exports = Video;
