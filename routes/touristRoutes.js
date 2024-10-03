const express = require("express");
const touristController= require('../controllers/touristController');
const router = express.Router();

// /tourist
// localhpost:8000/tourist
// router.get('/register', touristController.tourist_hello);
router.get('/search', touristController.searchTouristAttractions);
router.get("/viewActivities", touristController.viewTouristActivities);
router.get("/filterActivities", touristController.filterTouristActivities);

module.exports = router;