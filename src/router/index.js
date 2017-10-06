// const AuthenticationController = require('../controllers/AuthenticationController')
const SpotifyController = require('../controllers/SpotifyController')
const GracenoteController = require('../controllers/GracenoteController')
const AlbumsController = require('../controllers/AlbumsController')
const DiscogsController = require('../controllers/DiscogsController')

module.exports = (app) => {
  app.get('/albums',
    AlbumsController.index)
  app.get('/albums/:albumId',
    AlbumsController.show)
  app.put('/albums/:albumId',
    AlbumsController.put)
  app.post('/albums',
    AlbumsController.post)

  app.get('gracealbum',
    GracenoteController.getAlbum)

  app.get('/discogs/:album_id',
    DiscogsController.getAlbum)

  app.get('/spotify/:search_string',
    SpotifyController.getAlbum)
}
