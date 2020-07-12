const express = require('express');
const router = express.Router();

const doctorController = require('../../controllers/api/doctors_controller'); // importing action from doctor-controller

router.post('/register',doctorController.register);//route for registering as a doctor
router.post('/login',doctorController.login);//route for login and get token  as a doctor

module.exports = router;