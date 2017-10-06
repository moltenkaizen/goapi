const axios = require('axios')
const fs = require('fs')
const request = require('request')
const config = require('../config')
const discogsKey = config.discogsKey
const discogsSecret = config.discogsSecret

let Album = require('../models/Album')

module.exports = {
  index (req, res) {
    // all albums
    Album.find((err, albums) => {
      if (err) {
        res.send(err)
      } else {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With')
        res.json(albums)
      }
    })
  },
  show (req, res) {
    // single album
    Album.findById(req.params.albumId, (err, album) => {
      if (err) {
        res.send(err)
      } else {
        res.json(album)
      }
    })
  },
  post (req, res) {
    // add album
    function downloadImage (url, type, id) {
      // Download album cover from discogs and save it with the id
      // http://stackabuse.com/the-node-js-request-module/
      // https://github.com/request/request
      const file = fs.createWriteStream(`media/images/${id}_${type}.jpg`)
      const imageRequest = {
        uri: url,
        headers: {
          'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
          'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`
        }
      }
      request(imageRequest)
        .pipe(file)
        .on('error', (error) => {
          console.log('ahh bad things', error)
        })
    }

    let album = new Album()
    // create a new instance of the Album model
    // album = req.body
    album.artist = req.body.artist
    // set the albums artist (comes from the request)
    album.title = req.body.title
    album.year = req.body.year
    album.catalogNumber = req.body.catalogNumber
    album.country = req.body.country
    album.discogsID = req.body.discogsID
    album.format = req.body.format[0]
    album.thumb = req.body.thumb
    // album.cover = ''

    axios.get(`https://api.discogs.com/releases/${album.discogsID}`, {
      headers: {
        'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
        'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`
      }
    })
      .then((response) => {
        // console.log('cover =====>', response.data.images[0].uri)
        album.cover = response.data.images[0].uri
        // console.log('album from inside the promise: ', album)
        // console.log('album.cover ===>', album.cover)
        // save the album and check for errors
        album.save(function (err) {
          if (err) {
            console.log(err)
            res.send(err)
          } else {

            // it should really respond with the data from the newly save album. output from the database
          }
        })
        // console.log(savedAlbum)
        downloadImage(album.cover, 'cover', album._id)
        downloadImage(album.thumb, 'thumb', album._id)

        // Set response headers
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With')
        res.json(album)
      })
      .catch((error) => {
        console.log(error)
        res.json(error)
      })
  },
  put (req, res) {
    // update album
    Album.findById(req.params.albumId, (err, album) => {
      if (err) {
        res.send(err)
      }
      // album = req.body
      album.artist = req.body.artist
      // set the albums artist (comes from the request)
      album.title = req.body.title
      album.year = req.body.year
      // update the albums info

      // save the album
      album.save(function (err) {
        if (err) {
          res.send(err)
        } else {
          res.json({message: 'Album updated!'})
        }
      })
    })
  },
  delete (req, res) {
    // delete album
    Album.remove({
      _id: req.params.albumId
    }, function (err, album) {
      if (err) {
        res.send(err)
      } else {
        res.json({message: `Successfully deleted: ${album}`})
      }
    })
  }
}
