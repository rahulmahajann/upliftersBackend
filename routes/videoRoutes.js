const express = require('express');
const { addVideo, likeVideo, getVideo } = require('../controllers/videoControllers');
const validToken = require('../middleware/authorization');
const router = express.Router();

router.get('/healthy', (req, res) => {
    res.send('video route is working!');
});
router.post('/addVideo', validToken, addVideo);
router.put('/likeVideo', validToken, likeVideo);
router.get('/getVideo', validToken, getVideo);

module.exports = router;