let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/albums');

let Schema = mongoose.Schema;

let AlbumSchema = new Schema({
  artist: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: false
  },
  year: {
    type: Number,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  catalogNumber: {
    type: String,
    required: false
  },
  discogsID: {
    type: String,
    required: false,
    unique: false
  },
  spotifyID: {
    type: String
  }

});

module.exports = mongoose.model('Album', AlbumSchema);