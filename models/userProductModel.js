const mongoose= require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userProductSchema = mongoose.Schema({
        userId:{
            type:ObjectId,
            ref:'User',
        },
        productId:{
            type:ObjectId,
            ref:'Product',
        },
        addedToCart:{
            type:Boolean,
            default:false,
        },
        productClicked:{
            type:Number,
            default:0,
        },

        UIP:{
            type:Number,
            default:0,
        },
    },

    {
        timestamps:true,
    },
);

const UserProduct = mongoose.model('UserProduct',userProductSchema);

module.exports = UserProduct;