const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const secret = process.env.JWT_SECRET || 'is it secret, is it safe?';

    jwt.verify(authorization, secret, function(err, decodedToken){
      if (err) {
        res.status(401).json({ message: "invalid token" })
      } else {
        req.token = decodedToken;

        next()
      }
    });

  } else {
    res.status(400).json({ message: 'Please login and try again' });
  }
};
