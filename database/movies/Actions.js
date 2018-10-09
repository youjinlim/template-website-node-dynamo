// CRUD Reference for AWS DynamoDB
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html

/* [C]RUD - Placing items within */
exports.createMovie = function() {
  console.log('Create Movie');
  var AWS = require("aws-sdk");

  AWS.config.update({
    region: "ap-southeast-1",
    endpoint: "http://localhost:8000"
  });

  var docClient = new AWS.DynamoDB.DocumentClient();

  var table = "Movies";

  var year = 1999;
  var title = "A B C";
  var params = {
    TableName:table,
    Item:{
      "year": year,
      "title": title,
      "info":{
        "plot": "Nothing happens at all.",
        "rating": 0
      }
    }
  };

  console.log("Adding a new item...");
  docClient.put(params, function(err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log('data available');
      console.log(data);
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
};
/* [END]-[C]RUD - Placing items within */


/* C[R]UD - Retrieve */

/* C[R]UD - Retrieve 1 Movie */
exports.retrieveMovie = function() {
  console.log('Retrieve Movie');
  var AWS = require("aws-sdk");

  AWS.config.update({
    region: "us-southeast-1",
    endpoint: "http://localhost:8000"
  });

  var docClient = new AWS.DynamoDB.DocumentClient();

  var table = "Movies";

  var year = 1999;
  var title = "A B C";

  var retrieveParams = {
    TableName: table,
    Key:{
      "year": year,
      "title": title
    }
  };

  docClient.get(retrieveParams, function(err, data) {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
};

/* C[R]UD - Scan all movies */
exports.scanAllMovies = function() {
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

      return data;
    }
  }
};
/* [END]-C[R]UD - Retrieving */