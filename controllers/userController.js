const { blankFieldErrorMessage } = require('../constants/strings');
const USER = require('../models/userModels');
const jwt = require('jsonwebtoken');
const fast2sms = require('fast-two-sms');
require('dotenv').config();

const signUp = async (req, res) => {
    const {userName, userPhone} = req.body;
    if(!userPhone || !userName){
        return res.json({
            success: false,
            message: blankFieldErrorMessage,
        })
    }

    const isUser = await USER.findOne({userPhone});

    if(isUser){
        return res.json({
            success: false,
            message: 'Already Exist'
        })
    }else{
        const user = new USER({
            userName,
            userPhone
        })

        user.save()
            .then(async() => { 
                return res.json({
                    success: true,
                })
            }).catch((err) => {
                return res.json({
                    success: false,
                    message: err
                })
            })
    }   
}

const signIn = async (req, res) => {
    const {userPhone} = req.body;
    if(!userPhone){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    const isUser = await USER.findOne({userPhone});

    if(!isUser){
        return res.json({
            success: false,
            message: 'user not found with this number'
        })
    }else{

        const digits = '0123456789';
        let OTP = '';
        for(var i = 0; i < 6; i++){
            OTP += digits[Math.floor(Math.random() * 10)]
        }

        console.log(process.env.Fast_2_SMS_Key);

        try{
            const params = {
                authorization: process.env.Fast_2_SMS_Key,
                message: `Hey ${isUser.userName}, Your OTP for login is ${OTP} - from team Kala India.`,
                numbers: [`${userPhone}`]
            }

            fast2sms.sendMessage(params)
                .then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                })

            await USER.findByIdAndUpdate(isUser, {
                userOtp: OTP
            })


            return res.json({
                success: true,
                message: 'OTP sent successfully'
            })
        }catch(err){
            return res.json({
                success: false,
                message: err
            })
        }

    }
}

const validateOtp = async (req, res) => {
    const {otp, userPhone} = req.body;

    if(!otp || !userPhone){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    const isUser = await USER.findOne({userPhone});

    if(otp == isUser.userOtp){

        const token = jwt.sign({_id: isUser._id}, process.env.JWT_SECRET_KEY);
        console.log(token);
        
        return res.json({
            success: true,
            token,
            message: 'OTP matched'
        })

    }else{
        return res.json({
            success: false,
            message: 'OTP does not matched'
        })
    }

}

module.exports = {signUp, signIn, validateOtp};