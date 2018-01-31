var express = require('express')
var request = require('request')
var invokeFaceDetectApi = require('../util/facepp').invokeFaceDetectApi

var router = express.Router()
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

router.post('/image', upload.single('file'), function(req, res) {
  var image = req.file.filepath

  res.send('image received')
})

router.get('/testapi', function(req, res) {
  invokeFaceDetectApi('img1.png')
})

module.exports = router
