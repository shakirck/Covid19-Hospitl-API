const express = require('express');
const router = express.Router();
const jwtAuth = require('../../config/middleware');// importing the middleware for authentication of jwtToken
const patientController = require('../../controllers/api/patients_controller');//importing the actions from paitent-controller

router.post('/register',jwtAuth.verify,patientController.createPatient)//for registering a patient in to the DB or retrive info of patient
// // /patients/:id/create_report

router.post('/:id/create_report',jwtAuth.verify,patientController.createReport)//create a report for a patient having  id passed via parameter
router.get('/:id/all_reports',jwtAuth.verify,patientController.allReports);//get all reports of a patient having a id



module.exports = router;