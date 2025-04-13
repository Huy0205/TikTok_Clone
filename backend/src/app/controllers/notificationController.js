const { NotificationServices } = require("../services");

const getNotificationByReceiverId = async (req, res) => {
  const { receiverId } = req.query;
  if (!receiverId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "receiverId is required",
    });
  }

  const notificationRes =
    await NotificationServices.getNotificationByReceiverId(receiverId);
  return res.status(notificationRes.status).json(notificationRes);
};

const updateViewedById = async (req, res) => {
  const { id, viewed } = req.body;
  if (!id || viewed === undefined) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "id, viewed is required",
    });
  }

  const updateRes = await NotificationServices.updateViewedById(id, viewed);
  return res.status(updateRes.status).json(updateRes);
};

module.exports = {
  getNotificationByReceiverId,
  updateViewedById,
};
