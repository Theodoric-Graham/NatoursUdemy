const fs = require('fs');
const express = require('express');

const app = express();

//Middleware is a function that can modify incoming request data
//data from the body is added to the request object
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
// creating a variable named id
app.get('/api/v1/tours/:id/', (req, res) => {
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
});

// the req object is what holds all the data about the request that was done,
// and if that request contains some data that was sent, then that data should be
// on the request
// we need middleware
app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
