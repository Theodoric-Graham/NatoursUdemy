const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

// 1) Middlewares
app.use(morgan('dev'));
//Middleware is a function that can modify incoming request data
//data from the body is added to the request object
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 😍');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Route Handlers
// the req object is what holds all the data about the request that was done,
// and if that request contains some data that was sent, then that data should be
// on the request
// we need middleware

// app.get('/api/v1/tours', getAllTours);
// creating a variable named id
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id/', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) Routes
// the root of this url, creating a small sub app for each of these resources
// also called mounting the router, mounting a new router on a route
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
