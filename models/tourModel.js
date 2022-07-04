const mongoose = require('mongoose');

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
    },
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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
//always use uppercase on model names and variables, name, then schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
