const express = require('express');        // call express
const axios = require('axios');
const fs = require('fs');
const request = require('request');
const Gracenote = require("node-gracenote");

// Import Config
const config = require('../config');

// 3rd party API Keys
const discogsKey = config.discogsKey;
const discogsSecret = config.discogsSecret;
const spotifyClientID = config.spotifyClientID;
const spotifySecret = config.spotifySecret;
const gracenoteClientID = config.graceNoteClientID;
const gracenoteClientTag = config.graceNoteClientTag;
let userId = null;

let Album = require('../app/models/album');

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});

const gracenoteRegister = new Promise((resolve, reject) => {
  let api = new Gracenote(gracenoteClientID, gracenoteClientTag, userId);
  api.register((err, uid) => {
    if (err) {
      reject(err)
    } else {
      resolve(uid);
    }
  });
});

const gracenoteAlbum = (artist, title) => {
  return new Promise((resolve, reject) => {
    let api = new Gracenote(gracenoteClientID, gracenoteClientTag, userId);
    api.setExtended('COVER');
    api.searchAlbum(artist, title, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    }, { matchMode: Gracenote.BEST_MATCH_ONLY });
  });
};

router.get('/gracealbum', (req, res) => {
  if (!userId) {
    console.log('registering with gracenote');
    gracenoteRegister.then((uid) => {
      userId = uid;
      gracenoteAlbum(req.query.artist, req.query.title).then((result) => {
        res.json(result)
      }, (err) => {
        res.json(err);
      })
    }, (e) => {
      console.log(e);
    });
  } else {
    gracenoteAlbum(req.query.artist, req.query.title).then((result) => {
      res.json(result)
    }, (err) => {
      res.json(err);
    })
  }
});

router.get('/discogs/:album_id', (req, res) => {
  axios.get(`https://api.discogs.com/releases/${req.params.album_id}`, {
    headers: {
      'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
      'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`
    }
  })
    .then(function (response) {
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

// localhost:8081/api/spotify/Damien+Rice+O
router.get('/spotify/:search_string', (req, res) => {
  axios.get(`https://api.spotify.com/v1/search?q=${req.params.search_string}&type=album&market=US&limit=1`, {
    headers: {
      'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
      'Authorization': `Bearer ${spotifyToken}`
    }
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
  .post((req, res) => {
    // console.log(req);
    function downloadImage(url, type, id) {
      // Download album cover from discogs and save it with the id
      // http://stackabuse.com/the-node-js-request-module/
      // https://github.com/request/request
      const file = fs.createWriteStream(`media/images/${id}_${type}.jpg`);
      const imageRequest = {
        uri: url,
        headers: {
          'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
          'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`
        }
      };
      request(imageRequest)
        .pipe(file)
        .on('error', (error) => {
          console.log('ahh bad things', error);
        });
    }

    let album = new Album();      // create a new instance of the Album model
    // album = req.body;
    album.artist = req.body.artist;  // set the albums artist (comes from the request)
    album.title = req.body.title;
    album.year = req.body.year;
    album.catalogNumber = req.body.catalogNumber;
    album.country = req.body.country;
    album.discogsID = req.body.discogsID;
    album.format = req.body.format[0];
    album.thumb = req.body.thumb;
    // album.cover = '';

    axios.get(`https://api.discogs.com/releases/${album.discogsID}`, {
      headers: {
        'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
        'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`}
    })
      .then((response) => {
        // console.log('cover =====>', response.data.images[0].uri);
        album.cover = response.data.images[0].uri;
        // console.log('album from inside the promise: ', album);
        // console.log('album.cover ===>', album.cover);
        // save the album and check for errors
        album.save(function(err) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {

            // it should really respond with the data from the newly save album. output from the database
          }
        });
        // console.log(savedAlbum);
        downloadImage(album.cover, 'cover', album._id);
        downloadImage(album.thumb, 'thumb', album._id);

        // Set response headers
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(album);
      })
      .catch((error) => {
        console.log(error);
        res.json(error);
      });

  })
  // get all the albums (accessed at GET http://localhost:8080/api/albums)
  .get((req, res) => {
    Album.find(function(err, albums) {
      if (err) {
        res.send(err);
      } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.json(albums);
      }
    });
  });
// on routes that end in /albums/:album_id
// ----------------------------------------------------
router.route('/albums/:album_id')

// get the album with that id (accessed at GET http://localhost:8080/api/albums/:album_id)
  .get((req, res) => {
    Album.findById(req.params.album_id, (err, album) => {
      if (err) {
        res.send(err);
      } else {
        res.json(album);
      }
    });
  })
  // update the album with this id (accessed at PUT http://localhost:8080/api/albums/:album_id)
  .put(function(req, res) {

    // use our album model to find the album we want
    Album.findById(req.params.album_id, (err, album) => {
      if (err) {
        res.send(err);
      }
      // album = req.body;
      album.artist = req.body.artist;  // set the albums artist (comes from the request)
      album.title = req.body.title;
      album.year = req.body.year; // update the albums info

      // save the album
      album.save(function (err) {
        if (err) {
          res.send(err);
        } else {
          res.json({message: 'Album updated!'});
        }
      });
    })

  })
  // delete the album with this id (accessed at DELETE http://localhost:8080/api/albums/:album_id)
  .delete((req, res) => {
    Album.remove({
      _id: req.params.album_id
    }, function(err, album) {
      if (err){
        res.send(err);
      } else {
        res.json({ message: `Successfully deleted: ${album}` });
      }
    });
  });

module.exports = router;