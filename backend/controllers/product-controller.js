const Product = require('../models/product');

exports.addProduct = (request, response, next) => {
  const product = new Product({
    name: request.body.name,
    purchase_price: request.body.purchase_price,
    purchase_date: request.body.purchase_date,
    selling_price: request.body.selling_price,
    quantity: request.body.quantity,
    category: request.body.category,
    calories: request.body.calories,
    brand: request.body.brand,
    expiration: request.body.expiration
  });

  product.save().then(result => {
    response.status(201).json({
      message: 'Producto agregado correctamente.',
      result
    });
  }).catch(error => {
    let message = 'Ocurrió un error desconocido.';
    if (error.errors.name) {
      message = `El producto ${error.errors.name.value} ya existe en la base de datos.`;
    }

    response.status(500).json({
      message
    });
  });
};

exports.updateProduct = (request, response, next) => {
  const product = new Product({
    _id: request.body._id,
    name: request.body.name,
    purchase_price: request.body.purchase_price,
    purchase_date: request.body.purchase_date,
    selling_price: request.body.selling_price,
    quantity: request.body.quantity,
    category: request.body.category
  });

  Product.updateOne({ _id: request.params._id }, product).then(result => {
    if (result.n <= 0) {
      response.status(401).json({
        message: 'Actualización no autorizada.'
      });
    } else {
      response.status(200).json({
        message: 'Los datos del producto han sido actualizados.'
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

exports.getProducts = (request, response, next) => {
  let fetchedProducts;

  Product.find().then(documents => {
    fetchedProducts = documents;
    return Product.countDocuments();
  }).then(count => {
    response.status(200).json({
      message: 'Productos obtenidos correctamente.',
      products: fetchedProducts,
      productCount: count
    });
  }).catch(error => {
    response.status(500).json({
      message: 'Ocurrió un error desconocido.'
    });
  });
};

exports.deleteProduct = (request, response, next) => {
  Product.deleteOne({ _id: request.params._id }).then(result => {
    if (result.deletedCount <= 0) {
      response.status(401).json({
        message: 'Eliminación no autorizada.'
      });
    } else {
      response.status(200).json({
        message: 'Producto eliminado.'
      });
    }
  }).catch(error => {
    response.status(500).json({
      message: 'Eliminación de producto fallida.'
    });
  });
};
