const Tour = require('../models/tourModel');

//Parsing the data
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (+req.params.id > tours.length) {
//     // we need return so that it does not call next
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   console.log(req.body);
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// Controllers Handlers
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //Building Query
    // 1A) Filtering
    //we do this filtering in the route where we get all the tours
    //destructuring will take the fields out of the object, then we create a new object
    const queryObj = { ...req.query };
    //excluded so it could not pollute our filtering, ex: page=2, would not be able to return any documents
    //we need to exlude these special field names from our query string, before the filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    //1B) Advanced Filtering
    //turns into string
    //should give us a nicely formated object with the data from the query string
    let queryStr = JSON.stringify(queryObj);
    //regex that selects these strings and replaces them
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // gte / greater than or equal to
    // { difficulty: 'easy', duration: { $gte: 5}}
    // we need to add the mongodb operator $
    // { difficulty: 'easy', duration: { gte: '5' } }
    // gte, gt, lte, lt

    //when nothing is passed into the find method, it returns all docs in that collection
    // one way of writing a query, returns a query
    // pass in query object to filter based on those parameters
    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting
    //if sort property exists in the query object
    if (req.query.sort) {
      // console.log(req.query.sort);
      // console.log(req.query.sort.split(','));
      //splits a string into substrings using the specified seperator and return them as an array
      //join adds all the elements of an array seperated by the specified separator string
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
      //sort('price ratingsAverage)
    } else {
      //sort by the createdAt field in descending order
      query = query.sort('-createdAt');
    }

    //EXECUTE QUERY
    //as soon as we use await the query will execute and come back with the documents that match our query
    const tours = await query;

    //other way of writing a query using mongoose methods
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

  // console.log(req.params);
  // converting from string to number
  // const id = +req.params.id;
  // returns the first element that has our specified ID,
  // const tour = tours.find((el) => el.id === id);
  // if (id > tours.length) {
};

exports.createTour = async (req, res) => {
  try {
    // const newTours = new Tour({})
    // newTours.save()

    //Tour.create returns a promise, use async await to handle it
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },

      //body is a property that will be available because of the middleware
      // console.log(req.body);

      // const newId = tours[tours.length - 1].id + 1;
      // const newTour = Object.assign({ id: newId }, req.body);

      // tours.push(newTour);

      // fs.writeFile(
      //   `${__dirname}/dev-data/data/tours-simple.json`,
      //   JSON.stringify(tours),
      //   (err) => {
      //     // 201 stands for created
      //     res.status(201).json({
      //       status: 'success',
      //       data: {
      //         tour: newTour,
      //       },
      //     });
      //   }
      // );

      //We always need to send back something in order to finish the request response cycle
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    //query for the document that we want to update, then update it
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // this way the new updated document is the one that is returned
      new: true,
      //runs validators if updated based on schema
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        // tour: tour,
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    // 204 means no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
