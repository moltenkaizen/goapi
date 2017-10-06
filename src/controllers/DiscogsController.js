const config = require('../config')
const axios = require('axios')

const discogsKey = config.discogsKey
const discogsSecret = config.discogsSecret

module.exports = {
  getAlbum (req, res) {
    axios.get(`https://api.discogs.com/releases/${req.params.album_id}`, {
      headers: {
        'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
        'Authorization': `Discogs key=${discogsKey}, secret=${discogsSecret}`
      }
    })
      .then(function (response) {
        // https://enable-cors.org/server_expressjs.html
        // https://stackoverflow.com/questions/11181546/how-to-enable-cross-origin-resource-sharing-cors-in-the-express-js-framework-o
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With')
        res.json(response.data)
      })
      .catch(function (error) {
        console.log(error)
        res.json(error)
      })
  }
}
