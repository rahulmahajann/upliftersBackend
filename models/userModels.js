const mongoose = require('mongoose');

const user = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        userPhone: {
            type: Number,   //mehul op ki salah!
            required: true,
            unique:true,
        },
        userOtp: {
            type: Number,
        }
    },
    {
        timestamps: true,
    }
);

const USER = mongoose.model('User', user);
module.exports = USER;