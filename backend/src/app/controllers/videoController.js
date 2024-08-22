const {
  VideoServices,
  WatchHistoryServices,
  LikeServices,
  FollowServices,
} = require("../services");

const handleRecomendedVideos = async (req, res) => {
  const { currentTiktokId, page, limit } = req.query;

  const watchHistorysRes =
    await WatchHistoryServices.findWatchHistoryByWatcherId(currentTiktokId);

  const likesRes = await LikeServices.findLikesByLikerId(currentTiktokId);

  if (watchHistorysRes.code !== "OK" || likesRes.code !== "OK") {
    return res.status(500).json({
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    });
  }

  const watchHistorys = watchHistorysRes.data.map(
    (watchHistory) => watchHistory.videoId
  );

  const likes = likesRes.data.map((like) => like.videoId);

  const response = await VideoServices.recommendedVideos(
    currentTiktokId,
    watchHistorys,
    likes,
    parseInt(page),
    parseInt(limit)
  );

  return res.status(response.status).json(response);
};

const handleGetVideoByFollowing = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const { page, limit, sort } = req.query;

  const followingsRes = await FollowServices.findFollowByFollowerId(tiktokId);

  if (followingsRes.code !== "OK") {
    return res.status(500).json({
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    });
  }

  console.log(followingsRes.data);

  const followings = followingsRes.data.map((follow) => follow.followingId);

  const response = await VideoServices.getVideoByFollowing(
    followings,
    parseInt(page),
    parseInt(limit),
    sort ? parseInt(sort) : -1
  );

  return res.status(response.status).json(response);
};

const handleGetVideoByPublisherId = async (req, res) => {
  const { publisherId, page, limit, sort } = req.query;

  if (!publisherId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "publisherId is required",
    });
  }

  const response = await VideoServices.getVideoByPublisherId(
    publisherId,
    parseInt(page),
    parseInt(limit),
    sort ? parseInt(sort) : -1
  );

  return res.status(response.status).json(response);
};

const handleGetVideoUserLiked = async (req, res) => {
  const { userId, page, limit, sort } = req.query;

  if (!userId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "userId is required",
    });
  }

  const likesRes = await LikeServices.findLikesByLikerId(userId);
  if (likesRes.code !== "OK") {
    return res.status(500).json({
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    });
  }

  const likes = likesRes.data.map((like) => like.videoId);

  const response = await VideoServices.getVideoUserLiked(
    likes,
    parseInt(page),
    parseInt(limit),
    parseInt(sort)
  );

  return res.status(response.status).json(response);
};

module.exports = {
  handleRecomendedVideos,
  handleGetVideoByFollowing,
  handleGetVideoByPublisherId,
  handleGetVideoUserLiked,
};
