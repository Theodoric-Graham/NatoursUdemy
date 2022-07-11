const mongoose = require('mongoose');
const slugify = require('slugify');

//virtual properties are fields we define on our schema but that will not be persistent, they will not be saved to the database
//we cannot use virtial properties in a query, because they are technically not part of the database
//basic schema description
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal to 40 characters'],
      minlength: [10, 'A tour name must have more or equal to 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      //string validator
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      //min and max also works with dates
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      //schema type option for strings only, will remove whitespace at beginning and end
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      //automatically created timestamp
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // first object is the schema definition, and the second is for the options
  {
    //each time the output is JSON, then the virtuals are true, part of the output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//we define it on the tourSchema, pass in the name of the virtual property we
//need to define the get method, because the virtual property will be created
//each time that we get some data out of the database, a getter
//need to use a reg function here, because the this keyword in this case will be pointing to the current document
//an arrow function does not get its own this keyword
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//MONGOOSE MIDDLEWARE

//for example each time a document is saved to the database,
//we can run a function between when the saved command is issued and the actual
//saving of the document , or after the saving(pre/ post hooks)
//document middleware, can act on the currently processed document
//we define middleware on the schema
//pre will run before the event, in this case save

//DOCUMENT MIDDLEWARE: runs before .save() and .create() but not .insertMany()
//has access to next just like express
//pre save middleware has access to next
//pre save hook
tourSchema.pre('save', function (next) {
  //in a save middleware the this keyword will point to the currently processed document
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

//executed once all the pre middleware functions have completed
//no longer has this, but instead has the finished document in doc
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
//the find hook will make it query middleware and not document
// tourSchema.pre('find', function (next) {
//using regex we can execute the middleware with all the commands that starts with the word find
//find, findOne, findOneAndDelete, FindOneAndUpdate, FindOneAndRemove
tourSchema.pre(/^find/, function (next) {
  //this is now a query object, so we can chain all the methods we have for queries
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

//in the post find middleware we gain access to all the documents that were returned from the query
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  //this.pipeline is an array so we use unshift to add something at the begginning
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

//always use uppercase on model names and variables, name, then schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
