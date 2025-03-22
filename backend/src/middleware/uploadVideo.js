const multer = require("multer");

const storage = multer.memoryStorage();

const uploadVideo = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // Giới hạn 500MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("File không phải video"), false);
    }
  },
});

module.exports = uploadVideo;
