const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/'),
  filename (req, file, callback) {
    let filename = `upload-${Math.round(Math.random() * 10000)}.${req.body.filename.split('.')[1]}`;
    callback(null, filename);
  }
})

module.exports = multer({ storage })