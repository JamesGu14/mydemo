const express = require('express')
const router = express.Router()
const multer = require('multer');
const upload = multer({ dest: 'uploads/facesets/' })
const getFacesets = require('../util/facepp').getFacesets
const mysql = require('../models/index')
const uuidv1 = require('uuid/v1')
const fs = require('fs')
const facepp = require('../util/facepp')

router.get('/', function(req, res, next) {

  // getFacesets(function(facesets) {
  //   res.render('system/index', { title: 'System', facesets: facesets });
  // }) 

  mysql.Faceset.findAll().then(facesets => {
    mysql.Face.findAll().then(faces => {
      res.render('system/index', { title: 'System', facesets: facesets, faces: faces })
    })
  })
})

router.post('/face', upload.single('avatar'), function(req, res, next) {
  let filename = req.file.filename
  let filepath = req.file.path
  let newname = 'img-' + uuidv1() + '.png'
  let newpath = filepath.replace(filename, newname)
  let personName = req.body.personName
  let facesetTokenId = req.body.faceset

  mysql.Faceset.findOne({
    where: {
      id: facesetTokenId
    }
  }).then(faceset => {
    if (faceset == null) {
      return
    }
    fs.rename(filepath, newpath, function(err) {
      if (err) throw err
      facepp.detectFace(newpath, function(faces) {
        console.log(faces.length + ' faces detected. ')
        if (faces.length == 1) {
          // save to faceset
          facepp.addFace(faceset.token, faces[0].face_token, function(success) {
            if (success) {
              // Save to DB
              mysql.Face.create({
                token: faces[0].face_token,
                title: personName,
                comment: newpath,
                facesetId: facesetTokenId
              })
            }
          })
        }
      })
    })
  })
  res.send('image received')
})

module.exports = router