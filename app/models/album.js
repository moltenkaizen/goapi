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
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Album', AlbumSchema);