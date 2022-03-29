const Product = require("../models/productModel");
const Video = require("../models/videoModels");

const getProductDataSet = async () => {
    const productData = await Product.find();
    const pi = await Promise.all(productData.map(async ({_id, productTitle, productTags, productDescription}) => {
        const content = productTitle + productDescription + productTags.join(' ');
        return {
            id: _id,
            content
        };
    })
    )
    return pi;
}

const getVideoDataSet = async () => {
    const videoData = await Video.find();
    console.log(videoData[0]._id);
    const vi = await Promise.all(videoData.map(async ({_id, videoTitle, videoTags, relatedProduct}) => {
        let content = videoTitle + videoTags.join(' ');
        if(relatedProduct){
            const productInfo = await Product.findOne({
                _id: relatedProduct
            })
            const productTags = productInfo.productTags;
            content += productTags.join(' ');
        }
        return {
            id: _id,
            content
        };
    })
    )
    return vi;
}

module.exports = {getProductDataSet, getVideoDataSet};