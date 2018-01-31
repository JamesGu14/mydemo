const request = require('request')
const path = require('path')
const fs = require('fs');

const API_KEY = 'ZBGJP0FeHpWav70YBUvwhYBCadPczo9C'
const API_SECRET = 'ieQjQ0H9d2n5PMm796HlqasWW-MnOLEX'
const FACE_DETECT_URL = 'https://api-cn.faceplusplus.com/facepp/v3/detect'
// const FACE_CHARACTER = ['gender','age','smiling','headpose','facequality','blur','eyestatus','emotion','ethnicity','beauty','mouthstatus','eyegaze','skinstatus']
const FACE_CHARACTER = ['none']

function invokeFaceDetectApi(fileName) {
  let formData = {
    api_key: API_KEY,
    api_secret: API_SECRET,
    image_base64: base64_encode('uploads/' + fileName),
    return_attributes: FACE_CHARACTER.join(','),
  }
  request.post({url: FACE_DETECT_URL, formData: formData}, function(err, res, body) {
    if (err === null && res.statusCode === 200) {
      
      let content = JSON.parse(body);
      return content.faces.length
    }
  })
}

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

module.exports.invokeFaceDetectApi = invokeFaceDetectApi
