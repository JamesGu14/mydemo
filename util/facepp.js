const request = require('request')
const path = require('path')
const fs = require('fs');

const API_KEY = 'FQdEPmLhnUHT27YGELyCawzP1v7Cfeai'
const API_SECRET = '-MLbCqXeAiGP6YHI1K7DHCO14DsF5pIL'
const FACE_DETECT_URL = 'https://api-cn.faceplusplus.com/facepp/v3/detect'
const GET_FACESET_URL = 'https://api-cn.faceplusplus.com/facepp/v3/faceset/getfacesets'
const ADD_FACE_URL = 'https://api-cn.faceplusplus.com/facepp/v3/faceset/addface'
// const FACE_CHARACTER = ['gender','age','smiling','headpose','facequality','blur','eyestatus','emotion','ethnicity','beauty','mouthstatus','eyegaze','skinstatus']
const FACE_CHARACTER = ['none']

let detectFace = (filepath, next) => {
  let formData = {
    api_key: API_KEY,
    api_secret: API_SECRET,
    image_base64: base64_encode(filepath),
    return_attributes: FACE_CHARACTER.join(','),
  }
  request.post({url: FACE_DETECT_URL, formData: formData}, function(err, res, body) {
    if (err === null && res.statusCode === 200) {
      
      let content = JSON.parse(body);
      next(content.faces)
    }
  })
}

let searchFace = (next) => {

}

let getFacesets = (next) => {
  let formData = {
    api_key: API_KEY,
    api_secret: API_SECRET,
  }
  request.post({url: GET_FACESET_URL, formData: formData}, function(err, res, body) {
    if (err === null && res.statusCode === 200) {
      
      let content = JSON.parse(body);
      next(content.facesets)
    }
  })
}

let addFace = (faceset_token, face_tokens, next) => {
  let formData = {
    api_key: API_KEY,
    api_secret: API_SECRET,
    faceset_token: faceset_token,
    face_tokens: face_tokens
  }
  request.post({url: ADD_FACE_URL, formData: formData}, function(err, res, body) {
    if (err == null && res.statusCode == 200) {
      
      let content = JSON.parse(body);
      if (content.face_added == 1) {
        next(true)
      } else {
        next(false)
      }
    }
    next(false)
  })
}

let getFacesetDetail = (next) => {

}

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

module.exports = {
  detectFace: detectFace,
  getFacesets: getFacesets,
  addFace: addFace,
  getFacesetDetail: getFacesetDetail,
  searchFace: searchFace
}