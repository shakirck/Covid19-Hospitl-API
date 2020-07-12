const express = require('express');
const router = express.Router();
const jwtAuth = require('../../config/middleware');//jwt authentication middleware

const reportController = require('../../controllers/api/report_controller');

router.get('/:status',jwtAuth.verify,reportController.getReportsOfStatus);//route for getting all reports having a specified status


module.exports = router;