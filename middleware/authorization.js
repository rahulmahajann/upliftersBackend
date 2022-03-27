const jwt = require('jsonwebtoken');
const USER = require('../models/userModels');

const validToken = (req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.json({
            error: 'You are not logged in!'
        })
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {   
        if(err){
            return res.json({
                error: 'You are not logged in!'
            })
        }
        const {_id} = payload;
        const userInfo = await USER.findById(_id);
        req.user = userInfo;
        next();
    });
};

module.exports = validToken;