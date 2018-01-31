const express = require('express')
const request = require('request')
const fs = require('fs')
const uuidv1 = require('uuid/v1')

const facepp = require('../util/facepp')

const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

router.post('/image', upload.single('file'), function(req, res) {
  let filename = req.file.filename
  let filepath = req.file.path
  let newname = 'img-' + uuidv1() + '.png'
  let newpath = filepath.replace(filename, newname)

  fs.rename(filepath, newpath, function(err) {
    if (err) throw err
    facepp.detectFace(newpath, function(faces) {
      console.log(faces.length + ' faces detected. ')
    })
  })

  res.send('image received')
})

// router.get('/testapi', function(req, res) {
//   facepp.detectFace('img2.png')
// })

module.exports = router
