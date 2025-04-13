const { NotificationController } = require("../app/controllers");

const router = require("express").Router();

router.get("/receiver", NotificationController.getNotificationByReceiverId);

router.put('/update-viewed-by-id', NotificationController.updateViewedById);

module.exports = router;
