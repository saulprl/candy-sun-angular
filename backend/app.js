const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');

const app = express();

mongoose.connect(`mongodb+srv://phaseDB:${process.env.MONGO_ATLAS_PW}@cluster0-vaq5q.mongodb.net/candy-sun?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed! Testing on local database...');
    mongoose.connect(`mongodb://127.0.0.1:27017/candy-sun`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to local database!');
    }).catch(() => {
      console.log('Connection to local database failed!');
    });
  }
);


app.use((bodyParser.json()));

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

module.exports = app;
