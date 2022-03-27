const express = require('express');
const { setWatchTime } = require('../controllers/userVideoController');
const validToken = require('../middleware/authorization');
const router = express.Router();

router.get('/healthy', (req, res) => {
    res.send('video route is working!');
});
router.post('/setWatchTime', validToken, setWatchTime);

module.exports = router;