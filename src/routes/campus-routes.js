const express = require('express');
const router = express.Router();

const campusController = require('../controllers/campus-controllers');

// pagination using params
router.get('/:page/:limit', campusController.getCampuses);

// test route
router.get('/test', campusController.test);

module.exports = router;
