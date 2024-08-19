const { WatchHistory } = require("../models");

const findWatchHistoryByWatcherId = async (watcherId) => {
  console.log(watcherId);
  try {
    const watchHistorys = await WatchHistory.find({ watcherId })
      .sort({ updatedAt: -1 })
      .exec();
    return {
      status: 200,
      code: "OK",
      data: watchHistorys,
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
  findWatchHistoryByWatcherId,
};
