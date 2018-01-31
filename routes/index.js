const express = require('express')
const request = require('request')
const fs = require('fs')
const uuidv1 = require('uuid/v1')


var invokeFaceDetectApi = require('../util/facepp').invokeFaceDetectApi

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
    let faceCount = invokeFaceDetectApi(newname)
    if (faceCount > 0) {
      console.log(faceCount + ' faces detected. ')

      
    }
  })

  res.send('image received')
})

// router.get('/testapi', function(req, res) {
//   invokeFaceDetectApi('img2.png')
// })

module.exports = router
