const express = require('express');
const app = require('../app');
const tourController = require('./../controllers/tourController');
const router = express.Router();

//param middleware
router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if the body contains the name and price property
// if not, send back 400 (bad request)
// Add it to the post handler stack

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
