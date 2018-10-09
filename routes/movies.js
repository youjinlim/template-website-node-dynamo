// CRUD Reference for AWS DynamoDB
// 
var express = require('express');
var router = express.Router();

var movieActions = require('../database/movies/Actions');

/* GET home page. */
router.get('/', function(req, res, next) {
  // movieActions.createMovie();
  // movieActions.retrieveMovie();
    var AWS = require("aws-sdk");

    AWS.config.update({
      region: "us-southeast-1",
      endpoint: "http://localhost:8000"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
      TableName: "Movies",
      ProjectionExpression: "#yr, title, info",
      FilterExpression: "#yr between :start_yr and :end_yr",
      ExpressionAttributeNames: {
        "#yr": "year",
      },
      ExpressionAttributeValues: {
        ":start_yr": 1950,
        ":end_yr": 2013
      }
    };

    console.log("Scanning Movies table.");
    docClient.scan(params, onScan);

    function onScan(err, data) {
      if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        // print all the movies
        console.log("Scan succeeded.");
        data.Items.forEach(function(movie) {
          console.log(
            movie.year + ": ",
            movie.title, "- rating:", movie.info.rating);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
          console.log("Scanning for more...");
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          docClient.scan(params, onScan);
        }
      }
      res.status(200).json({ movies: data })
    }
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  console.log(req.headers);
  // var year = req.body.year;
  // var title = req.body.title;
  // var info = req.body.info;
  // movieActions.createMovie();
  res.status(201).json({
    message: "created"
  })
});

module.exports = router;
