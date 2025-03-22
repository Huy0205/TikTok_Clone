const {
  VideoServices,
  WatchHistoryServices,
  LikeServices,
  FollowServices,
  SaveServices,
} = require("../services");
const { hashVideo } = require("../../utils");
const { Types } = require("mongoose");
const { emitOne } = require("../../socket");

const handleRecomendedVideos = async (req, res) => {
  const { currentTiktokId, page, limit } = req.query;

  const [watchHistorysRes, likesRes, savesRes] = await Promise.all([
    WatchHistoryServices.findWatchHistoryByWatcherId(currentTiktokId),
    LikeServices.getLikesByLikerId(currentTiktokId),
    SaveServices.getSavesBySaverId(currentTiktokId),
  ]);

  if (
    watchHistorysRes.code !== "OK" ||
    likesRes.code !== "OK" ||
    savesRes.code !== "OK"
  ) {
    return res.status(500).json({
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    });
  }

  const watchHistorys = watchHistorysRes.data.map(
    (watchHistory) => new Types.ObjectId(watchHistory.videoId)
  );
  const likes = likesRes.data.map((like) => new Types.ObjectId(like.videoId));
  const saves = savesRes.data.map((save) => new Types.ObjectId(save.videoId));

  const response = await VideoServices.recommendedVideos(
    currentTiktokId,
    watchHistorys,
    likes,
    saves,
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
  const { tiktokId, page, limit, sort } = req.query;

  if (!tiktokId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "tiktokId is required",
    });
  }

  const likesRes = await LikeServices.getLikesByLikerId(tiktokId);
  if (likesRes.code !== "OK") {
    return res.status(500).json({
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    });
  }

  const likes = likesRes.data.map((like) => new Types.ObjectId(like.videoId));

  const response = await VideoServices.getVideoUserLikedOrSaved(
    likes,
    parseInt(page),
    parseInt(limit),
    parseInt(sort)
  );

  return res.status(response.status).json(response);
};

const handleGetVideoUserSaved = async (req, res) => {
  const { tiktokId, page, limit, sort } = req.query;

  if (!tiktokId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "userId is required",
    });
  }

  const savesRes = await SaveServices.getSavesBySaverId(tiktokId);
  if (savesRes.code !== "OK") {
    return res.status(500).json({
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    });
  }

  const saves = savesRes.data.map((save) => new Types.ObjectId(save.videoId));

  const response = await VideoServices.getVideoUserLikedOrSaved(
    saves,
    parseInt(page),
    parseInt(limit),
    parseInt(sort)
  );

  return res.status(response.status).json(response);
};

const handleUploadVideo = async (req, res) => {
  const { file, user } = req;

  if (!file || !user) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "video file, user is required",
    });
  }

  // Kiểm tra video trùng
  const hash = await hashVideo(file.buffer);
  emitOne(user.tiktokId, "uploadProgress", { progress: 5 });
  const videoByHashRes = await VideoServices.getVideoByHash(hash);
  emitOne(user.tiktokId, "uploadProgress", { progress: 15 });
  if (videoByHashRes.data) {
    emitOne(user.tiktokId, "uploadProgress", { progress: 100 });
    return res.status(200).json({
      status: 200,
      code: "NONE_UPLOAD",
      data: {
        cloudinary_public_id: videoByHashRes.data.cloudinary_public_id,
        original_url: videoByHashRes.data.original_url, // Link gốc MP4
        hls_url: videoByHashRes.data.hls_url, // Link phát HLS (.m3u8)
        width: videoByHashRes.data.width,
        height: videoByHashRes.data.height,
        music: videoByHashRes.data.music,
        hash: videoByHashRes.data.hash,
      },
    });
  }

  const response = await VideoServices.uploadVideo(
    file.buffer,
    hash,
    user.tiktokId
  );
  return res.status(response.status).json(response);
};

const handleSaveVideo = async (req, res) => {
  const {
    music,
    publisherId,
    title,
    cloudinary_public_id,
    original_url,
    hls_url,
    width,
    height,
    hash,
  } = req.body;
  if (
    !music ||
    !publisherId ||
    !cloudinary_public_id ||
    !original_url ||
    !hls_url ||
    !width ||
    !height ||
    !hash
  ) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message:
        "music, publisherId, cloudinary_public_id, original_url, hls_url, width, height, hash is required",
    });
  }

  // Kiểm tra xem người đăng đã đăng video này chưa
  const videoRes = await VideoServices.getVideoByHashAndPublisherId(
    hash,
    publisherId
  );
  if (videoRes.data) {
    return res.status(409).json({
      status: 409,
      code: "DUPLICATE_VIDEO",
      message: "You have already uploaded this video before.",
    });
  }

  const response = await VideoServices.saveVideo({
    music,
    publisherId,
    title,
    cloudinary_public_id,
    original_url,
    hls_url,
    width,
    height,
    hash,
    shares: 0,
  });
  return res.status(response.status).json(response);
};

module.exports = {
  handleRecomendedVideos,
  handleGetVideoByFollowing,
  handleGetVideoByPublisherId,
  handleGetVideoUserLiked,
  handleGetVideoUserSaved,
  handleUploadVideo,
  handleSaveVideo,
};
