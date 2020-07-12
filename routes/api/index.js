const express = require('express');
const router = express.Router();

 
router.use('/doctors',require('./doctors'));//route for doctor
router.use('/patients',require('./patients'));//route for patients
router.use('/reports',require('./reports'));//route for reports

module.exports = router;