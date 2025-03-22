const Save = require("../models/save");

const getSavesBySaverId = async (saverId) => {
  try {
    const saves = await Save.find({ saverId }).sort({ createdAt: -1 }).exec();
    return {
      status: 200,
      code: "OK",
      data: saves,
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

const countSavesByVideoId = async (videoId) => {
  try {
    const saveCount = await Save.countDocuments({ videoId });
    return {
      status: 200,
      code: "OK",
      data: saveCount,
    };
  } catch (error) {
    console.error("Error counting saves:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const addSave = async (save) => {
  try {
    const result = await Save.create(save);
    return {
      status: 200,
      code: "OK",
      data: result,
    };
  } catch (error) {
    console.error("Error adding save:", error);
    return {
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    };
  }
};

const deleteSave = async (saveId) => {
  try {
    const deletedCount = await Save.findOneAndDelete({ _id: saveId });

    if (!deletedCount) {
      return {
        status: 404,
        code: "NOT_FOUND",
        message: "Save not found",
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
  getSavesBySaverId,
  countSavesByVideoId,
  addSave,
  deleteSave,
};
