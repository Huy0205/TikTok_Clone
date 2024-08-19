const { Follow } = require("../models");

const findFollowByFollowerId = async (followerId) => {
  try {
    const follows = await Follow.find({ followerId })
      .sort({ createdAt: -1 })
      .exec();
    return {
      status: 200,
      code: "OK",
      data: follows,
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

const checkFollow = async (followerId, followingId) => {
  try {
    const follow = await Follow.findOne({ followerId, followingId }).exec();
    return {
      status: 200,
      code: "OK",
      data: follow,
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

const countFollowOfUser = async (userId) => {
  try {
    const count = await Follow.find({ followingId: userId }).countDocuments();
    return {
      status: 200,
      code: "OK",
      data: count,
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

const addFollow = async (followerId, followingId) => {
  try {
    const follow = new Follow({ followerId, followingId });
    await follow.save();
    return {
      status: 200,
      code: "OK",
      data: follow,
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

const removeFollow = async (followerId, followingId) => {
  try {
    await Follow.deleteOne({ followerId, followingId }).exec();
    return {
      status: 200,
      code: "OK",
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
  findFollowByFollowerId,
  checkFollow,
  countFollowOfUser,
  addFollow,
  removeFollow,
};
