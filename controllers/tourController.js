const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

//prefilling the query string for the user
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficuly';
  next();
};

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
exports.getAllTours = catchAsync(async (req, res, next) => {
  // console.log(req.query);

  //Building Query
  // 1A) Filtering
  //we do this filtering in the route where we get all the tours
  //destructuring will take the fields out of the object, then we create a new object
  // const queryObj = { ...req.query };
  //excluded so it could not pollute our filtering, ex: page=2, would not be able to return any documents
  //we need to exlude these special field names from our query string, before the filtering
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);
  // console.log(req.query, queryObj);

  //1B) Advanced Filtering
  //turns into string
  //should give us a nicely formated object with the data from the query string
  // let queryStr = JSON.stringify(queryObj);
  //regex that selects these strings and replaces them
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // console.log(JSON.parse(queryStr));

  // gte / greater than or equal to
  // { difficulty: 'easy', duration: { $gte: 5}}
  // we need to add the mongodb operator $
  // { difficulty: 'easy', duration: { gte: '5' } }
  // gte, gt, lte, lt

  //when nothing is passed into the find method, it returns all docs in that collection
  // one way of writing a query, returns a query
  // pass in query object to filter based on those parameters
  // let query = Tour.find(JSON.parse(queryStr));

  //2) Sorting
  //if sort property exists in the query object
  // if (req.query.sort) {
  // console.log(req.query.sort);
  // console.log(req.query.sort.split(','));
  //splits a string into substrings using the specified seperator and return them as an array
  //join adds all the elements of an array seperated by the specified separator string
  // const sortBy = req.query.sort.split(',').join(' ');
  // console.log(sortBy);
  // query = query.sort(sortBy);
  //sort('price ratingsAverage)
  // } else {
  //sort by the createdAt field in descending order
  //   query = query.sort('-_id');
  // }

  // 3) Field Limiting
  // if (req.query.fields) {
  // console.log(req.query.fields.split(','));
  // { fields: 'name,duration,difficulty,price' }
  // [ 'name', 'duration', 'difficulty', 'price' ]
  // const fields = req.query.fields.split(',').join(' ');
  //the operation of selecting only certain field names is called projecting'
  //select expects a string like 'name duration price'
  // query = query.select(fields);
  // } else {
  // - excludes
  // query = query.select('-__v');
  // }
  // 4) Pagination
  //converting from string to number, and setting 1 as the default value
  // const page = +req.query.page || 1;
  // setting page limit to 100
  // const limit = +req.query.limit || 100;
  // ex: page = 3, limit = 10, (3-1) * 10 = 2 * 10 = skip = 20
  // const skip = (page - 1) * limit;
  // console.log(page);
  //page=2&limit=10, 1-10, page 1, 11=2-, page 2, 21-30, page 3
  //limit is exactly the same as the limit we defined in the query string
  //skip is the amount of results that should be skipped before querying any data
  // query = query.skip(skip).limit(limit);

  // if (req.query.page) {
  // going to return the number of documents, returns a promise
  // const numTours = await Tour.countDocuments();
  // if (skip >= numTours) throw new Error('This page does not exist');
  // }

  //EXECUTE QUERY
  //creating an instance of the class that will then get stored to features, will have access to all methods
  // we pass in a query object, and query string that comes from express
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  //as soon as we use await the query will execute and come back with the documents that match our query
  const tours = await features.query;
  //query.sort().select().skip().limit()

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
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id })

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });

  // console.log(req.params);
  // converting from string to number
  // const id = +req.params.id;
  // returns the first element that has our specified ID,
  // const tour = tours.find((el) => el.id === id);
  // if (id > tours.length) {
});

//the function we pass into catchAsync is fn
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // try {
  // const newTours = new Tour({})
  // newTours.save()

  //Tour.create returns a promise, use async await to handle it

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
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  // 204 means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  // aggregation pipeline is a mongodb feat, but mongoose allows us access so we can use it in the mongoose driver
  // similar to a regular query, pass in an array of stages, going to return an aggregate obj, needs to be awaited
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      //need to specify _id first
      $group: {
        //we do this so we can have everything together so we can calculate the stats for all the tours together
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: {
          $avg: '$ratingsAverage',
        },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // 1 for ascending
      $sort: { avgPrice: 1 },
    },
    //can use match again in the pipeline
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      // tour: tour,
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year; //2021

  const plan = await Tour.aggregate([
    {
      //will deconstruct an array field from the input documents, and then output 1 document for each element of the array
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          //we need a new date so that we can compare it with the date in the documents
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        //passing in the name of the field where we want to extract the date from
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        //pushing the tours by name into an array
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        //this will make it so that the id no longer shows up
        _id: 0,
      },
    },
    {
      //-1 is descending
      $sort: { numTourStarts: -1 },
    },
    {
      //sets a limit
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
