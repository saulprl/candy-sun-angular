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
        message: 'Usuario creado correctamente.',
        result: result
      });
    }).catch(error => {
      let message = 'Ocurrió un error desconocido.';
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
        message: 'No existe un usuario con esa dirección de correo electrónico.'
      });
    }

    fetchedUser = user;
    return bcrypt.compare(request.body.password, user.password);
  }).then(result => {
    if (!result) {
      return response.status(401).json({
        message: 'Las credenciales de autenticación son incorrectas.'
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
      message: 'Sesión iniciada correctamente.',
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      userName: fetchedUser.name
    });
  }).catch(error => {
    response.status(401).json({
      message: `Ocurrió el siguiente error: ${error.MongoError.keyValue}`
    });
  });
};

exports.getUsers = (request, response, next) => {
  let fetchedUsers;

  User.find().then(documents => {
    fetchedUsers = documents;
    return User.countDocuments();
  }).then(count => {
    response.status(200).json({
      message: 'Usuarios obtenidos correctamente.',
      employees: fetchedUsers,
      employeeCount: count
    });
  }).catch(error => {
    response.status(500).json({
      message: 'Ocurrió un error desconocido.'
    });
  });
};

exports.updateUser = (request, response, next) => {
  const user = new User({
    _id: request.body._id,
    name: request.body.name,
    surname: request.body.surname,
    dob: request.body.dob,
    email: request.body.email
  });

  User.updateOne({ _id: request.params._id }, user).then(result => {
    if (result.n <= 0) {
      response.status(401).json({
        message: 'Actualización no autorizada.'
      });
    } else {
      response.status(200).json({
        message: 'Los datos del empleado han sido actualizados.'
      });
    }
  }).catch(error => {
    let message = 'Ocurrió un error.';
    if (error.MongoError) {
      message = `${error.MongoError.keyValue} ya está en uso.`;
    }

    response.status(500).json({
      message
    });
  });
};

exports.deleteUser = (request, response, next) => {
  User.deleteOne({ _id: request.params._id }).then(result => {
    if (result.deletedCount <= 0) {
      response.status(401).json({
        message: 'Eliminación no autorizada.'
      });
    } else {
      response.status(200).json({
        message: 'Empleado eliminado.'
      });
    }
  }).catch(error => {
    response.status(500).json({
      message: 'Eliminación del empleado fallida.'
    });
  });
};
