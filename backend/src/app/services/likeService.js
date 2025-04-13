const { Like } = require("../models");

const getLikesByLikerId = async (likerId) => {
  try {
    const likes = await Like.find({ likerId }).sort({ createdAt: -1 }).exec();
    return {
      status: 200,
      code: "OK",
      data: likes,
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

const countLikesByVideoId = async (videoId) => {
  try {
    const likeCount = await Like.countDocuments({ videoId });
    return {
      status: 200,
      code: "OK",
      data: likeCount,
    };
  } catch (error) {
    console.error("Error counting likes:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const countLikesOfVideos = async (videos) => {
  try {
    const likeCount = await Like.countDocuments({ videoId: { $in: videos } });
    return {
      status: 200,
      code: "OK",
      data: likeCount,
    };
  } catch (error) {
    console.error("Error counting likes of videos:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const saveLike = async (like) => {
  try {
    const savedLike = await Like.create(like);
    return {
      status: 200,
      code: "OK",
      data: savedLike,
    };
  } catch (error) {
    console.error("Error saving like:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const deleteLike = async (likeId) => {
  try {
    const deletedCount = await Like.findOneAndDelete({ _id: likeId });

    if (!deletedCount) {
      return {
        status: 404,
        code: "NOT_FOUND",
        message: "Like not found",
      };
    }

    return {
      status: 200,
      code: "OK",
      data: deletedCount,
    };
  } catch (error) {
    console.error("Error deleting like:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

module.exports = {
  getLikesByLikerId,
  countLikesByVideoId,
  countLikesOfVideos,
  saveLike,
  deleteLike,
};
