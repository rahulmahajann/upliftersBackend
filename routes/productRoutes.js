const express = require('express');
const { addProduct } = require('../controllers/productController');
const validToken = require('../middleware/authorization');
const router = express.Router();

router.get('/healthy', (req, res) => {
    res.send('product route is working!');
});
router.post('/addProduct', validToken, addProduct);

module.exports = router;