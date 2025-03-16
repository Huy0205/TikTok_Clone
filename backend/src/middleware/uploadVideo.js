const multer = require("multer");
const path = require("path");

// Cấu hình lưu file tạm vào thư mục "uploads"
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/"), // Lưu tạm file trước khi up Cloudinary
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Chỉ chấp nhận video, giới hạn 500MB
const uploadVideo = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("File không phải video"), false);
    }
  },
});

module.exports = uploadVideo;
