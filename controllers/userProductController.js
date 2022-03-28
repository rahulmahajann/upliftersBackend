const { blankFieldErrorMessage } = require("../constants/strings");
const UserProduct = require("../models/userProductModel");

const addUserProduct = async(req, res) => {
    const userInfo = req.headers;
    const {productId, clicked} = req.body;
    if(!productId){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    console.log(typeof clicked);

    const isUserProduct = await UserProduct.findOne({
        userId: userInfo._id,
        productId
    })

    if(isUserProduct){
        if(clicked === 'true'){
            const initialClicks = isUserProduct.productClicked;
            isUserProduct.productClicked = initialClicks + 1;
            isUserProduct.save()
                .then(() => {
                    return res.json({
                        success: true,
                        message: 'clicks updated'
                    })
                }).catch((err) => {
                    return res.json({
                        success: false,
                        message: err
                    })
                })   
        }else{
            const isAdded = isUserProduct.addedToCart;
            isUserProduct.addedToCart = !isAdded;
            isUserProduct.save()
                .then(() => {
                    return res.json({
                        success: true,
                        message: 'Changed cart status'
                    })
                }).catch((err) => {
                    return res.json({
                        success: false,
                        message: err
                    })
                })
        }
    }else{
        if(clicked === 'true'){
            const newUserProduct = new UserProduct({
                userId: userInfo._id,
                productId,
                productClicked: 1,
            })
            newUserProduct.save()
                .then(() => {
                    return res.json({
                        success: true,
                        message: 'Clicks Updated'
                    })
                }).catch((err) => { 
                    return res.json({
                        success: false,
                        message: err
                    })
                })
        }else{
            const newUserProduct = new UserProduct({
                userId: userInfo._id,
                productId,
                addedToCart: true,
            });
            newUserProduct.save()
                .then(() => {
                    return res.json({
                        success: true,
                        message: 'Cart Updated'
                    })
                }).catch((err) => { 
                    return res.json({
                        success: false,
                        message: err
                    })
                })
        }
    }

};

module.exports = {addUserProduct};