const { getRelatedProductsForPid, getSearchedProducts } = require("../constants/recommendationModel");
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

    productFound.relatedProducts = relatedProductData;

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
    const userInfo = req.user;
    const {searchParameter} = req.body;

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

module.exports = {addProduct, getProductDescription, getProductListing};