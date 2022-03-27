const express = require('express');
const { signUp, signIn, validateOtp } = require('../controllers/userController');
const validToken = require('../middleware/authorization');
const router = express.Router();

router.get('/healthy', (req, res) => {
    res.send('user route is working!');
});
router.post('/signUp', signUp);
router.put('/signIn', signIn);
router.post('/validateOtp', validateOtp);

module.exports = router;