const express = require('express');
const { getHomePageData } = require('../controllers/homeController');
const validToken = require('../middleware/authorization');
const router = express.Router();

router.get('/healthy', (req, res) => {
    res.send('product route is working!');
});
router.get('/getHomePage', validToken, getHomePageData);

module.exports = router;