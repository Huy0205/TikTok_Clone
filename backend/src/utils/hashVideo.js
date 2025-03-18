const fs = require("fs");
const crypto = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const { imageHash } = require("image-hash");
const md5File = require("md5-file");
const path = require("path");

// Cấu hình fluent-ffmpeg để dùng FFmpeg từ package cài đặt
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Đảm bảo thư mục tồn tại trước khi tạo file
function ensureDirExists(dir) {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

// Trích xuất 1 frame ảnh từ video
function extractFrame(videoPath, second, framePath, frameName) {
  ensureDirExists("../uploads/frames");
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [second],
        filename: frameName,
        folder: framePath,
        size: "?x640",
      })
      .on("end", () => resolve(framePath))
      .on("error", (err) => reject(`Lỗi trích xuất frame: ${err}`));
  });
}

// Trích xuất âm thanh từ video
function extractAudio(videoPath, audioPath) {
  ensureDirExists("../uploads/audios");
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .noVideo()
      .audioCodec("aac")
      .on("end", () => resolve(audioPath))
      .on("error", (err) => reject(`Lỗi trích xuất âm thanh: ${err}`))
      .run();
  });
}

// Hash hình ảnh bằng perceptual hashing
function hashImage(imagePath) {
  return new Promise((resolve, reject) => {
    imageHash(imagePath, 16, true, (err, hash) => {
      if (err) reject(`Lỗi hash ảnh: ${err}`);
      else resolve(hash);
    });
  });
}

// Hash âm thanh bằng MD5
async function hashAudio(audioPath) {
  return md5File(audioPath);
}

// Hàm hash toàn bộ video
async function hashVideo(videoPath) {
  try {
    // Tạo frame hash
    const frameName = `frame_${Date.now()}.jpg`;
    const framePath = path.join(__dirname, "../uploads/frames");
    await extractFrame(videoPath, 5, framePath, frameName);
    const imageHash = await hashImage(path.join(framePath, frameName));
    fs.unlinkSync(path.join(framePath, frameName));

    // Tạo audio hash
    const audioPath = path.join(
      __dirname,
      "../uploads/audios",
      `audio_${Date.now()}.aac`
    );
    await extractAudio(videoPath, audioPath);
    const audioHash = await hashAudio(audioPath);
    fs.unlinkSync(audioPath);

    // Gộp hash ảnh + âm thanh, sau đó hash lại bằng SHA-256
    const combinedHash = crypto
      .createHash("sha256")
      .update(imageHash + audioHash)
      .digest("hex");

    return combinedHash;
  } catch (error) {
    console.error("Lỗi khi hash video:", error);
    return null;
  }
}

module.exports = hashVideo;
