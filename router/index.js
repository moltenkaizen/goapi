const express    = require('express');        // call express

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router



// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});


router.get('/discogs/:album_id', function(req, res) {
  axios.get(`https://api.discogs.com/releases/${req.params.album_id}`, {
    headers: {
      'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
      'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`}
  })
    .then(function (response) {
      // console.log(response.data);
      // https://enable-cors.org/server_expressjs.html
      // https://stackoverflow.com/questions/11181546/how-to-enable-cross-origin-resource-sharing-cors-in-the-express-js-framework-o
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.json(error);
    });
});

router.get('/spotify/:album_id', function(req, res) {
  axios.get(`https://api.spotify.com/v1/search${req.params.album_id}`, {
    headers: {
      'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
      'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`}
  })
    .then(function (response) {
      // console.log(response.data);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.json(error);
    });
});
// more routes for our API will happen here
// on routes that end in /albums
// ----------------------------------------------------
router.route('/albums')

// create a album (accessed at POST http://localhost:8080/api/albums)
  .post(function(req, res) {

    let album = new Album();      // create a new instance of the Album model
    album.artist = req.body.artist;  // set the albums artist (comes from the request)
    album.title = req.body.title;
    album.year = req.body.year;
    album.catalogNumber = req.body.catalogNumber;
    album.country = req.body.country;
    album.discogsID = req.body.discogsID;
    // save the album and check for errors
    album.save(function(err) {
      if (err)
        console.log(err);
      res.send(err);
      res.json({ message: 'Album created!' });
    });

  })
  // get all the albums (accessed at GET http://localhost:8080/api/albums)
  .get(function(req, res) {
    Album.find(function(err, albums) {
      if (err)
        res.send(err);

      res.json(albums);
    });
  });
// on routes that end in /albums/:album_id
// ----------------------------------------------------
router.route('/albums/:album_id')

// get the album with that id (accessed at GET http://localhost:8080/api/albums/:album_id)
  .get(function(req, res) {
    Album.findById(req.params.album_id, function(err, album) {
      if (err)
        res.send(err);
      res.json(album);
    });
  })
  // update the album with this id (accessed at PUT http://localhost:8080/api/albums/:album_id)
  .put(function(req, res) {

    // use our album model to find the album we want
    Album.findById(req.params.album_id, function(err, album) {

      if (err)
        res.send(err);

      album.artist = req.body.artist;  // set the albums artist (comes from the request)
      album.title = req.body.title;
      album.year = req.body.year; // update the albums info

      // save the album
      album.save(function (err) {
        if (err)
          res.send(err);

        res.json({message: 'Album updated!'});
      });
    })

  })
  // delete the album with this id (accessed at DELETE http://localhost:8080/api/albums/:album_id)
  .delete(function(req, res) {
    Album.remove({
      _id: req.params.album_id
    }, function(err, album) {
      if (err)
        res.send(err);

      res.json({ message: `Successfully deleted: ${album}` });
    });
  });

module.exports = router;