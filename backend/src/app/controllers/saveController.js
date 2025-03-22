const { SaveServices } = require("../services");

const handleCountSavesByVideoId = async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "videoId is required",
    });
  }

  const countSavesRes = await SaveServices.countSavesByVideoId(videoId);
  return res.status(countSavesRes.status).json(countSavesRes);
};

const handleAddSave = async (req, res) => {
  const { saverId, videoId } = req.body;
  if (!saverId || !videoId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "saverId, videoId is required",
    });
  }

  const addRes = await SaveServices.addSave({
    saverId,
    videoId,
  });
  return res.status(addRes.status).json(addRes);
};

const handleDeleteSave = async (req, res) => {
  const { saveId } = req.query;
  if (!saveId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "saveId is required",
    });
  }

  const deleteRes = await SaveServices.deleteSave(saveId);
  return res.status(deleteRes.status).json(deleteRes);
};

module.exports = {
  handleCountSavesByVideoId,
  handleAddSave,
  handleDeleteSave,
};
