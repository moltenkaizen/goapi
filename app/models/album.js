const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/albums');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  artist: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: false
  },
  country: {
    type: String,
    required: true
  },
  catalogNumber: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  discogsID: {
    type: String,
    required: true,
    unique: false
  },
  spotifyID: {
    type: String
  },
  thumb: {
    type: String
  },
  cover: {
    type: String
  }

});


module.exports = mongoose.model('Album', AlbumSchema);