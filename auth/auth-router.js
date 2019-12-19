const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Step 1 import our jsonwebtoken after we npm i it

const Users = require('../users/users-model.js');
const secrets = require('../config/secrets'); // Step 6 import our secrets.js file from config

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//Step 2 got to go to login and sign the token
router.post('/login', (req, res) => { 
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // Step 2, using sessions and cookies this library will send cookie automatically, we need to create a token that will take a function that generates a token
        const token = generateToken(user)

        // Step 4, add the token in our response
        res.status(200).json({
          message: `Welcome ${user.username}!`,
         token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Step 3, write the generateToken function
// No sensitive info ever stored in a token!!!
// function is signing the token
function generateToken(user){
  const payload = {
    subject: user.id, // sub
    username: user.username,
    role: 'student' // this will come from the database
    // ...other data
  };

  // const secret = process.env.JWT_SECRET || 'asdfasdfsadfasdlkmlk'; Step 7, this is no longer needed

  const options = {
    expiresIn: '8h',
  }

  // Step 7 - changing secret to secrets.jwtSecret
  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
