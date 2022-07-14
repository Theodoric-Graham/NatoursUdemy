const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// can run in different environments, dev and prod, depending on the env, we may do different things
// express sets the env to development by default
// 1) Middlewares
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  //responsible for console log
  app.use(morgan('dev'));
}
//Middleware is a function that can modify incoming request data
//data from the body is added to the request object
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

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

//adding middleware after the routers will only be reached if not handled by any of the other routers
//.all() will check all the HTTP methods
//since we want to handle all urls that were not handled before, we can use * to handle everything
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  //if next recieves an argument no matter what, express will know there was an error, that applies to every next function
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
