const { KeywordServices } = require("../services");

const handleInscreaseKeywordCount = async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    return res.status(400).json({
      status: 400,
      message: "Keyword is required",
    });
  }
  const response = await KeywordServices.inscreaseKeywordCount(keyword);
  return res.status(response.status).json(response);
};

const handleSearch = async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    return res.status(400).json({
      status: 400,
      code: "KEYWORD_REQUIRED",
      message: "Keyword is required",
    });
  }
  const response = await KeywordServices.search(keyword);
  return res.status(response.status).json(response);
};

module.exports = {
  handleInscreaseKeywordCount,
  handleSearch,
};
