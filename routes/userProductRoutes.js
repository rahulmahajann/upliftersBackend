const express = require('express');
const { addUserProduct } = require('../controllers/userProductController');
const validToken = require('../middleware/authorization');
const router = express.Router();

router.get('/healthy', (req, res) => {
    res.send('user product route is working!');
});
router.post('/addUserProduct', validToken, addUserProduct);

module.exports = router;