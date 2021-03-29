/** @format */

let multer = require("multer");
let storage = multer.diskStorage({
  // this will specify the destination
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  // name of the file
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname + "" + new Date().toISOString().replace(/:/g, "-")
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("File not suppoted"), false);
  }
};
var upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
