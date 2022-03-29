const { getRelatedProductsForPid, getSearchedProducts } = require("../constants/recommendationModel");
const { blankFieldErrorMessage } = require("../constants/strings");
const Product = require('../models/productModel');
const UserProduct = require("../models/userProductModel");

const addProduct = async(req, res) => {

    const {productImage, productCost, productTitle, productTags, productDescription, productStory} = req.body;

    if(!productTitle || !productCost || !productImage || !productTags || !productDescription){
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
        productTitle,
        productCost
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

    if(!productId){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    const productFound = await Product.findOne({_id:productId});
    
    // arrays of ID dega reolated items ka!
    const relatedProducts = await getRelatedProductsForPid(productId);

    const relatedProductData = [];
    for(var i = 0; i < relatedProducts.length; i++){
        const productInfo = await Product.findOne({
            _id: relatedProducts[i]._id
        })

        relatedProductData.push(productInfo);
    }

    const newProductInfo = {
        ...productFound._doc,
        relatedProducts: relatedProductData
    }

    if(!productFound){
        return res.json({
            success: false,
            message: err
        })
    }
    else{
        return res.json({
            success:true,
            message: newProductInfo
        })
    }
    
};

const getProductListing = async (req, res) => {
    const userInfo = req.user;
    const {searchParameter} = req.body;
    console.log(searchParameter);

    if(!searchParameter){
        return res.json({
            success: false,
            message: blankFieldErrorMessage
        })
    }

    const similarProducts = await getSearchedProducts(searchParameter, userInfo._id);
    const productData = [];
    for(var i = 0; i < similarProducts.length; i++){
        const productInfo = await Product.findOne({
            _id: similarProducts[i]._id
        })

        productData.push(productInfo);
    }

    return res.json({
        productData
    })
    
}

const getCartProduct = async(req, res) => {
    const userInfo = req.user;

    const getProductId = await UserProduct.find({
        userId: userInfo._id,
        addedToCart: true
    })

    const cartProducts = [];

    for(var i = 0; i < getProductId.length; i++){
        const productInfo = await Product.findOne({
            _id: getProductId[i].productId
        });

        cartProducts.push(productInfo);
    }

    return res.json({
        success: true,
        message: cartProducts
    })
}

module.exports = {addProduct, getCartProduct, getProductDescription, getProductListing};