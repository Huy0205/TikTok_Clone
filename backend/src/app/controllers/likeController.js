const { Types } = require("mongoose");
const { LikeServices, VideoServices } = require("../services");

const handleCountLikesByVideoId = async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "videoId is required",
    });
  }

  const countLikesRes = await LikeServices.countLikesByVideoId(videoId);
  return res.status(countLikesRes.status).json(countLikesRes);
};

const handleCountLikesByPublisherId = async (req, res) => {
  const { publisherId } = req.query;
  if (!publisherId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "publisherId is required",
    });
  }

  const videosRes = await VideoServices.getVideoByPublisherId(publisherId);
  if (videosRes.code === "OK") {
    const videos = videosRes.data.map((video) => new Types.ObjectId(video._id));
    const countLikeRes = await LikeServices.countLikesOfVideos(videos);
    return res.status(countLikeRes.status).json(countLikeRes);
  } else {
    return res.status(videosRes.status).json(videosRes);
  }
};

const handleSaveLike = async (req, res) => {
  const { likerId, videoId } = req.body;
  if (!likerId || !videoId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "likerId, videoId is required",
    });
  }

  const saveRes = await LikeServices.saveLike({
    likerId,
    videoId,
  });
  return res.status(saveRes.status).json(saveRes);
};

const handleDeleteLike = async (req, res) => {
  const { likeId } = req.query;
  if (!likeId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "likeId is required",
    });
  }

  const deleteRes = await LikeServices.deleteLike(likeId);
  return res.status(deleteRes.status).json(deleteRes);
};

module.exports = {
  handleCountLikesByVideoId,
  handleCountLikesByPublisherId,
  handleSaveLike,
  handleDeleteLike,
};
