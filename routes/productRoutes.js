const express = require('express');
const { addProduct, getProductListing, getProductDescription, getCartProduct } = require('../controllers/productController');
const validToken = require('../middleware/authorization');
const router = express.Router();

router.get('/healthy', (req, res) => {
    res.send('product route is working!');
});
router.post('/addProduct', validToken, addProduct);
router.post('/getSearchedProducts', validToken, getProductListing);
router.post('/getProductDescription', validToken, getProductDescription);
router.get('/getCart', validToken, getCartProduct);
module.exports = router;