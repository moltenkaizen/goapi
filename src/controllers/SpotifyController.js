// const config = require('../config')
const axios = require('axios')
// const spotifyClientID = config.spotifyClientID
// const spotifySecret = config.spotifySecret
let spotifyToken = 'asdfasdfasdf'

module.exports = {
  getAlbum (req, res) {
    axios.get(`https://api.spotify.com/v1/search?q=${req.params.search_string}&type=album&market=US&limit=1`, {
      headers: {
        'User-Agent': 'MediaCat/0.1 +http://mediacat.rocks',
        'Authorization': `Bearer ${spotifyToken}`
      }
    })
      .then(function (response) {
        // console.log(response.data)
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
