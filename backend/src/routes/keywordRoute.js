const router = require("express").Router();
const { KeywordControllers } = require("../app/controllers");

router.post(
  "/inscrease-keyword-count",
  KeywordControllers.handleInscreaseKeywordCount
);

router.get("/search", KeywordControllers.handleSearch);

module.exports = router;
