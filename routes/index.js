const express = require('express');
const router = express.Router();

//main  route for api
router.use('/api',require('./api'));

module.exports = router;