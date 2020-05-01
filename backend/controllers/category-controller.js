const Category = require('../models/category');

exports.addCategory = (request, response, next) => {
  const category = new Category({
    name: request.body.name
  });

  category.save().then(result => {
    response.status(201).json({
      message: 'Categoría agregada correctamente.',
      result
    });
  }).catch(error => {
    let message = 'Ocurrió un error desconocido.';
    if (error.errors.name) {
      message =  `La categoría ${error.errors.name.value} ya existe en la base de datos.`;
    }

    response.status(500).json({
      message
    });
  });
};

exports.updateCategory = (request, response, next) => {
  const category = new Category({
    _id: request.body._id,
    name: request.body.name
  });

  Category.updateOne({ _id: category._id }, category).then(result => {
    if (result.n <= 0) {
      response.status(401).json({
        message: 'Actualización no autorizada.'
      });
    } else {
      response.status(200).json({
        message: 'Los datos de la categoría han sido actualizados.'
      });
    }
  }).catch(error => {
    let message = 'Ocurrió un error desconocido.';
    if (error.MongoError) {
      message = `${error.MongoError.keyValue} ya está en uso.`;
    }

    response.status(500).json({
      message
    });
  });
};

exports.getCategories = (request, response, next) => {
  let fetchedCategories;

  Category.find().then(documents => {
    fetchedCategories = documents;
    return Category.countDocuments();
  }).then(count => {
    response.status(200).json({
      message: 'Categorías obtenidas correctamente.',
      categories: fetchedCategories,
      categoryCount: count
    });
  }).catch(error => {
    response.status(500).json({
      message: 'Ocurrió un error desconocido.'
    });
  });
};

exports.deleteCategory = (request, response, next) => {
  Category.deleteOne({ _id: request.params._id }).then(result => {
    if (result.deletedCount <= 0) {
      response.status(401).json({
        message: 'Eliminación no autorizada.'
      });
    } else {
      response.status(200).json({
        message: 'Categoría eliminada.'
      });
    }
  }).catch(error => {
    response.status(500).json({
      message: 'Eliminación de la categoría fallida.'
    });
  });
};


