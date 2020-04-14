const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (request, response, next) => {
  bcrypt.hash(request.body.password, 10).then(hash => {
    const user = new User({
      name: request.body.name,
      surname: request.body.surname,
      dob: request.body.dob,
      email: request.body.email,
      password: hash
    });

    user.save().then(result => {
      response.status(201).json({
        message: 'User created',
        result: result
      });
    }).catch(error => {
      let message = 'An error occurred';
      if (error.errors.email) {
        message = `The email ${error.errors.email.value} is already in use.`;
      }

      response.status(500).json({
        message
      });
    });
  });
};

exports.login = (request, response, next) => {
  let fetchedUser;

  User.findOne({ email: request.body.email }).then(user => {
    if (!user) {
      return response.status(401).json({
        message: 'No user found.'
      });
    }

    fetchedUser = user;
    return bcrypt.compare(request.body.password, user.password);
  }).then(result => {
    if (!result) {
      return response.status(401).json({
        message: 'Authentication credentials are invalid.'
      });
    }

    const token = jwt.sign(
      {
        email: fetchedUser.email,
        id: fetchedUser._id
      },
      process.env.JWT_KEY,
      {
        expiresIn: '1h'
      }
    );

    response.status(200).json({
      message: 'Logged in successfully!',
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      userName: fetchedUser.name
    });
  }).catch(error => {
    response.status(401).json({
      message: 'An error occurred.'
    });
  });
};
