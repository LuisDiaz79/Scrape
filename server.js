var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
let path = require('path');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrape";
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Routes
var routes = require("./controllers/article.js");

app.use(routes);

// Start the server
app.listen(PORT, function() {
  console.log(`DB running on port ${MONGODB_URI} !`);
  console.log("App running on port " + PORT + "!");
});
