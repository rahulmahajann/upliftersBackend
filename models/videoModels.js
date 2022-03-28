const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
        videoTitle:{
            type:String,
            required:true,
        },

        videoTags:{
            type:Array,
            required:true,
        },

        videoURL:{
            type:String,
            required:true,
        }, 

        likes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }],
        relatedProduct:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
        }
        
    },

    {
        timestamps:true,
    }

);

const Video = mongoose.model('Video',videoSchema);
module.exports = Video;
