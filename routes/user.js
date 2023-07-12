const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const { follow, unfollowing, unfollower } = require('../controllers/user');

router.post('/:id/follow', isLoggedIn, follow);
router.post('/:id/unfollowing', isLoggedIn, unfollowing);
router.post('/:id/unfollower', isLoggedIn, unfollower);


module.exports = router;