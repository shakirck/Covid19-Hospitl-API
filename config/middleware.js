const jwt = require('jsonwebtoken');
const keys = require('./keys');

//custom jwt authentication

module.exports.verify = function (req, res, next) {
  //Auth Header token  format : Bearer TOKEN
  const authorizationHeader = req.headers['authorization']; //getting the auth headers from the incoming request
  if (authorizationHeader === undefined) {
    //checking if request have authheader or not ,if no auth header is undefined then authentication will fail
    return res.status(403).json({
      message: ' Forbidden',
    });
  }
  const authToken = authorizationHeader.split(' ')[1]; //spliting the bearer token and getting only the token;

  jwt.verify(authToken, keys.jwt.secret, function (err, doctor) {
    //veriying the token
    if (err) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    req.doctor = doctor;
    next();
  });
};
