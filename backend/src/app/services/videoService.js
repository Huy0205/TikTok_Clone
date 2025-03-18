const fs = require("fs");
const { cloudinary } = require("../../config");
const Video = require("../models/video");
const { connect } = require("tls");

/**
 * @param { ID của người dùng đang đăng nhập } watcherId
 * @param { Mảng chứa các ID của video mà người dùng đã xem (xem tối thiểu 50%) } watchHistorys
 * @param { Mảng chứa các ID của video mà người dùng đã like } likes
 * @param { Trang hiển thị } page
 * @param { Kích thước trang } limit
 * @returns { Mảng chứa các video được gợi ý }
 */
const recommendedVideos = async (
  watcherId,
  watchHistorys = [],
  likes = [],
  page = 1,
  limit = 10
) => {
  try {
    const videos = await Video.aggregate([
      {
        $match: {
          publisherId: { $ne: watcherId },
          _id: { $nin: watchHistorys },
          _id: { $nin: likes },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const getVideoByFollowing = async (
  followings,
  page = 1,
  limit = 10,
  sort = -1
) => {
  try {
    const videos = await Video.aggregate([
      {
        $match: {
          publisherId: { $in: followings },
        },
      },
      {
        $sort: { createdAt: sort },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const getVideoByPublisherId = async (
  publisherId,
  page = 1,
  limit = 10,
  sort = -1
) => {
  try {
    const videos = await Video.aggregate([
      {
        $match: {
          publisherId,
        },
      },
      {
        $sort: { createdAt: sort },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const getVideoUserLiked = async (likes, page = 1, limit = 10, sort = -1) => {
  try {
    const videos = await Video.aggregate([
      {
        $match: {
          _id: { $in: likes },
        },
      },
      {
        $sort: { createdAt: sort },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const getVideoByHash = async (hash) => {
  try {
    const videos = await Video.find({ hash }).sort({ createdAt: 1 }).limit(1);
    return {
      status: 200,
      code: "OK",
      data: videos.length > 0 ? videos[0] : null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const getVideoByHashAndPublisherId = async (hash, publisherId) => {
  try {
    const videos = await Video.find({ hash, publisherId })
      .sort({ createdAt: 1 })
      .limit(1);
    return {
      status: 200,
      code: "OK",
      data: videos.length > 0 ? videos[0] : null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

/**
 * Upload file lên Cloudinary
 * @param {string} filePath - Đường dẫn tệp cần upload
 * @returns {Promise<Object>} - Thông tin tệp upload
 */
const uploadVideo = async (filePath, hash) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "TikTok_Clone/video",
      resource_type: "video",
      chunk_size: 20 * 1024 * 1024,
      // Tạo phiên bản HLS (.m3u8) sau khi upload
      eager: [
        { streaming_profile: "hd", format: "m3u8" }, // Chuyển đổi sang HLS
      ],
    });

    return {
      status: 200,
      code: "OK",
      data: {
        cloudinary_public_id: result.public_id,
        original_url: result.secure_url, // Link gốc MP4
        hls_url: result.eager[0].secure_url, // Link phát HLS (.m3u8)
        width: result.width,
        height: result.height,
        hash,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  } finally {
    // Xóa file sau khi upload xong/lỗi để tiết kiệm bộ nhớ
    if (filePath && fs.existsSync(filePath)) {
      fs.promises
        .unlink(filePath)
        .then(() => console.log("Đã xóa file tạm:", filePath))
        .catch((err) => console.error("Lỗi khi xóa file tạm:", err));
    }
  }
};

const saveVideo = async (video) => {
  try {
    const videoSaved = await Video.create(video);
    return {
      status: 200,
      code: "OK",
      data: videoSaved,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

module.exports = {
  recommendedVideos,
  getVideoByFollowing,
  getVideoByPublisherId,
  getVideoUserLiked,
  getVideoByHash,
  getVideoByHashAndPublisherId,
  uploadVideo,
  saveVideo,
};
