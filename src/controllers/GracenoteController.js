const config = require('../config')
const gracenoteClientID = config.graceNoteClientID
const gracenoteClientTag = config.graceNoteClientTag
const Gracenote = require('node-gracenote')
let userId = null

const gracenoteRegister = new Promise((resolve, reject) => {
  let api = new Gracenote(gracenoteClientID, gracenoteClientTag, userId)
  api.register((err, uid) => {
    if (err) {
      reject(err)
    } else {
      resolve(uid)
    }
  })
})

const gracenoteAlbum = (artist, title) => {
  return new Promise((resolve, reject) => {
    let api = new Gracenote(gracenoteClientID, gracenoteClientTag, userId)
    api.setExtended('COVER')
    api.searchAlbum(artist, title, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    }, { matchMode: Gracenote.BEST_MATCH_ONLY })
  })
}

module.exports = {
  getAlbum (req, res) {
    if (!userId) {
      console.log('registering with gracenote')
      gracenoteRegister.then((uid) => {
        userId = uid
        gracenoteAlbum(req.query.artist, req.query.title).then((result) => {
          res.json(result)
        }, (err) => {
          res.json(err)
        })
      }, (e) => {
        console.log(e)
      })
    } else {
      gracenoteAlbum(req.query.artist, req.query.title).then((result) => {
        res.json(result)
      }, (err) => {
        res.json(err)
      })
    }
  }
}
