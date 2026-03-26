const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');


const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json()); 

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'MERN Project API',
      version: '1.0.0',
      description: 'API documentation for MERN Project',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not finde this route.', 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error occurred!'});
});

const password = 'Holasoyelpjiji12314141';
const url = 'mongodb+srv://Felipe:'+ password +'@cluster0.ehja6nw.mongodb.net/?appName=Cluster0'

mongoose
  .connect(url)
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });

