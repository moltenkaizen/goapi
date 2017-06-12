// server.js

// BASE SETUP
// =============================================================================


// call the packages we need
const express    = require('express');        // call express
const morgan = require('morgan');
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const axios = require('axios');
const router = require('./router/index');
// Import Config
const config = require('./config');

// 3rd party API Keys
const discogsKey = config.discogsKey;
const discogsSecret = config.discogsSecret;

const spotifyClientID = config.spotifyClientID;
const spotifySecret = config.spotifySecret;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('combined'));

const port = process.env.PORT || 8081;        // set our port

// REGISTER OUR ROUTES -------------------------------
// all of our router will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);