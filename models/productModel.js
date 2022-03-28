const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

        productTitle : {
            type:String,
            required:true,
        },

        productImage : {
            type:String,
            required:true,
        },

        productTags:{
            type:Array,
            required:true,
        },

        productDescription:{
            type:String,
            required:true,
        },

        productStory : {
            type:String,
        }
    },
    {
        timestamps:true,
    },
);

const Product = mongoose.model('Product',productSchema);

module.exports=Product;


