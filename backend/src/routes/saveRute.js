const { SaveController } = require("../app/controllers");

const router = require("express").Router();

router.get("/count-by-videoId", SaveController.handleCountSavesByVideoId);

router.post("/add", SaveController.handleAddSave);

router.delete("/delete", SaveController.handleDeleteSave);

module.exports = router;
