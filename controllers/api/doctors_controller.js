const Doctor = require('../../models/doctors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys'); //secret keys

//for registering a doctor
module.exports.register = async function (req, res) {
  //checking if  a doctor is already registered or not
  const doctor = await Doctor.findOne({
    username: req.body.username,
  });

  //if new doctor
  if (!doctor) {
    console.log('doctor not registered');
    // console.log('req.body', req.body);
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    console.log(hashPassword);
    //create a new doctor in the db
    Doctor.create({
      username: req.body.username,
      password: hashPassword,
      name: req.body.name,
    });

    //return the success message
    return res.status(200).json({
      message: 'Doctor  Registered',
      Doctor: req.body.name,
    });
  } else {
    return res.status(200).json({
      message: 'Already Registered',
    });
  }
};

//for login and generating token
module.exports.login = async function (req, res) {
  //finding the doctor from the db
  const doctor = await Doctor.findOne({
    username: req.body.username,
  });
  //if not found then return with error
  if (!doctor) {
    return res.status(403).json({
      message: 'username/password incorrect',
    });
  }

  //checking  the entered password with the hashed password    stored in db
  const checkPassword = bcrypt.compareSync(req.body.password, doctor.password);
  if (!checkPassword) {
    return res.status(403).json({
      message: 'username or password incorrect',
    });
  }

  //generating a  authentication token
  const token = jwt.sign({ _id: doctor._id }, keys.jwt.secret, {
    expiresIn: '1h',
  });

  return res.status(200).json({
    message: 'user login successfulll',
    token: token,
  });
};
