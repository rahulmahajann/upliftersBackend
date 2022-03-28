const { blankFieldErrorMessage } = require("../constants/strings");
const Product = require('../models/productModel');

const addProduct = async(req, res) => {

    const {productImage, productTitle, productTags, productDescription, productStory} = req.body;

    if(!productTitle || !productImage || !productTags || !productDescription){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })        
    }

    const newProduct = new Product({
        productImage,
        productStory,
        productDescription,
        productTags,
        productTitle
    });
    
    newProduct.save()
        .then(() => {
            return res.json({
                success: true,
                message: 'product saved successfully'
            })
        }).catch((err) => {
            return res.json({
                success: false,
                message: err
            })
        })
};

const getProductDescription = async (req, res) => {
    const {productId} = req.body;

    if(!producId){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    const productFound = await Product.findOne({_id:productId});

    if(!productFound){
        return res.json({
            success: false,
            message: err
        })
    }
    else{
        return res.json({
            success:true,
            message:productFound
        })
    }
    
};

const getProductListing = async (req, res) => {
    const {searchParameter} = req.body;

    if(!searchParameter){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    // function(searchParameter){
        // return arrOfObjects -> id's
    // }

    productData = [];

    for(var i = 0; i < arrObj.length; i++){
        const productInfo = await Product.findOne({
            _id: arrObj[i]._id
        })

        productData.push(productInfo);

    }

    return res.json({
        productData
    })
    
}

module.exports = {addProduct, getProductDescription, getProductListing};