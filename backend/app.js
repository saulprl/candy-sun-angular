const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/users');

const app = express();

mongoose.connect(`mongodb://127.0.0.1:27017/candy-sun`,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to local database!');
  }).catch(() => {
    console.log('Connection to local database failed!');
  });

app.use((bodyParser.json()));

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/users', userRoutes);

module.exports = app;
