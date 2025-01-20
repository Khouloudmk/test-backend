const express = require('express');
const { signUp, loginUser } = require('../controllers/userController');
const router = express.Router();

router.post('/add', signUp);
router.post('/login', loginUser);

module.exports = router;