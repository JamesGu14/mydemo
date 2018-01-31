const express = require('express')
const request = require('request')
const fs = require('fs')
const uuidv1 = require('uuid/v1')
const async = require('async')
const mysql = require('../models/index')

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
      if (faces.length < 1) {
        return res.json({ match: false, })
      }
      var names = []
      async.each(faces, function(face, callback) {
        facepp.searchFace('00a0885f4742c6c106104224b6707ca4', face.face_token, function(results) {
          if (results != null && results.results != null) {
            if (results.results.length > 0) {
              let confidence = results.results[0].confidence
              console.log('==========' + confidence)
              if (confidence > 80) {
                let confi_face_token = results.results[0].face_token
                mysql.Face.findOne({
                  where: {
                    token: confi_face_token
                  }
                }).then(match => {
                  if (match != null) {
                    names.push(match.title + '(' + confidence + ')')
                  }
                  callback()
                })
              } else {
                callback()
              }
            }
          }
        })
      }, function(err) {
        // if any of the file processing produced an error, err would equal that error
        if( err ) {
          // One of the iterations produced an error.
          // All processing will now stop.
          console.log(err);
        } else {
          if (names.length > 0) {
            res.json({
              match: true, 
              msg: 'Welcome to PwC SDC Emerging Tech Lab, ' + names.join(', ') + '!'
            })
          } else {
            res.json({
              match: false,
            })
          }
        }
      });
    })
  })
})

// router.get('/testapi', function(req, res) {
//   facepp.detectFace('img2.png')
// })

module.exports = router
