const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userVideoSchema = mongoose.Schema(
    {
        userId: {
            type: ObjectId,
            ref: 'User'
        },
        videoId: {
            type: ObjectId,
            ref: 'Video'
        },
        watchTime: {
            type: Number
        },
        liked: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

const UserVideo = mongoose.model('uservideo', userVideoSchema);
module.exports = UserVideo;