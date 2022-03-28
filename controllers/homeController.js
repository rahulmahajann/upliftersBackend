const { recommendItems, getRelatedToProduct } = require("../constants/recommendationModel");
const Product = require("../models/productModel");

const getHomePageData = async (req, res) => {
    
    const userInfo = req.user;

    const ri = await recommendItems(1, 6);
    const rtp = await getRelatedToProduct(2);


    const rId = await Promise.all(ri.map(async (id) => {
        const productInfo = await Product.findOne({
            _id: id
        });
        return productInfo;
    })
    )

    const rTpd = await Promise.all(rtp.map(async ({id,relatedProdutcs}) => {
        const productInfo = await Product.findOne({
            _id: id
        });
        const rPd = await Promise.all(relatedProdutcs.map(async (id) => {
            const productInfo = await Product.findOne({
                _id: id
            });
            return productInfo;
        })
        )
        
        return {
            name: productInfo.productTitle,
            relatedProdutcs: rPd
        };
    })
    )

    return {
            relatedToProducts: rTpd,
            recommendedProducts: rId
        }

}

module.exports = {getHomePageData};