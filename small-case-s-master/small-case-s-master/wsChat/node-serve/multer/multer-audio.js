const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: path.join(__dirname, "../audio/"),
  filename(req, file, cb) {
    let filename = `uploadAudio-${Date.now()}.${file.originalname.split(".")[1]}`;
    cb(null, filename);
  },
});

var upload = multer({
  storage,
});

module.exports = upload;
