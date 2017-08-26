// server.js

// BASE SETUP
// =============================================================================


// call the packages we need
const express    = require('express');        // call express
const morgan = require('morgan');
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const router = require('./router/index');
const cors = require('cors');
const serveStatic = require('serve-static');
const path = require('path');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('combined'));
app.use(cors());
const port = process.env.PORT || 8081;        // set our port

// Serve album cover images
app.use(serveStatic(path.join(__dirname, 'media')));
// http://localhost:8081/images/4772779.jpg

// REGISTER OUR ROUTES -------------------------------
// all of our router will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);