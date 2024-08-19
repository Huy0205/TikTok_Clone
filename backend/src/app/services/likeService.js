const { Like } = require("../models");

const findLikesByLikerId = async (likerId) => {
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

module.exports = {
  findLikesByLikerId,
};
