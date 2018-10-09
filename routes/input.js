var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    title: 'Upload Page - SGB',
    instruction: 'Place your JWT in your header ' +
    'under Authorization and proceed to POST your information'
  });
});

module.exports = router;