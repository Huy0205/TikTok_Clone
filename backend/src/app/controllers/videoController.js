const { VideoServices, UserServices } = require("../services");

const handleRecomendedVideos = async (req, res) => {
  console.log("handleRecomendedVideos");
  const { currentTiktokId, page, limit } = req.query;
  console.log(currentTiktokId, page, limit);
};

const handleGetVideoByFollowing = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const { page, limit } = req.query;
};

module.exports = {
  handleRecomendedVideos,
  handleGetVideoByFollowing,
};
