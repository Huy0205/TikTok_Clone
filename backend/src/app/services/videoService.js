const Video = require("../models/video");

/**
 * @param { ID của người dùng đang đăng nhập} watcherId
 * @param { Mảng chứa các ID của video mà người dùng đã xem } watchHistorys
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
    const videos = Video.aggregate([
      
    ])
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

const getVideoByFollowing = async (following, page = 1, limit = 10) => {
  try {
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

module.exports = {
  recommendedVideos,
  getVideoByFollowing,
};
