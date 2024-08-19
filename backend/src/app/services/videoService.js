const { configDotenv } = require("dotenv");
const Video = require("../models/video");

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

module.exports = {
  recommendedVideos,
  getVideoByFollowing,
  getVideoByPublisherId,
  getVideoUserLiked,
};
