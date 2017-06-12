let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/albums');

let Schema = mongoose.Schema;

let AlbumSchema = new Schema({
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
    required: true
  },
  country: {
    type: String,
    required: true
  },
  catalogNumber: {
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
  }

});

module.exports = mongoose.model('Album', AlbumSchema);