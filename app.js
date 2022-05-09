const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) Middlewares
app.use(morgan('dev'));
//Middleware is a function that can modify incoming request data
//data from the body is added to the request object
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 😍');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) Route Handlers
// the req object is what holds all the data about the request that was done,
// and if that request contains some data that was sent, then that data should be
// on the request
// we need middleware
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  // converting from string to number
  const id = +req.params.id;
  // returns the first element that has our specified ID,
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //body is a property that will be available because of the middleware
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 201 stands for created
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );

  //We always need to send back something in order to finish the request response cycle
};

const updateTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // 204 means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  //code 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet defined!',
  });
};

const getUser = (req, res) => {
  //code 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet defined!',
  });
};

const createUser = (req, res) => {
  //code 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  //code 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  //code 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'The route is not yet defined!',
  });
};

// app.get('/api/v1/tours', getAllTours);
// creating a variable named id
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id/', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) Routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id/')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4) Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
