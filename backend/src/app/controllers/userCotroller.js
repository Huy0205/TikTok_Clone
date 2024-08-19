const { UserServices, FollowServices } = require("../services");

const handleGetAccountAuth = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const response = await UserServices.getUserByTiktokId(tiktokId);
  return res.status(response.status).json(response);
};

const handleGetUserByTiktokId = async (req, res) => {
  const { tiktokId } = req.query;
  if (!tiktokId) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "TiktokId is required",
    });
  }
  const response = await UserServices.getUserByTiktokId(tiktokId);
  return res.status(response.status).json(response);
};

const handleSendOTPByMail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "Email is required",
    });
  }
  const response = await UserServices.sendOTPByMail(email);
  return res.status(response.status).json(response);
};

const handleVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  if (!email || !otp) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "Email and OTP are required",
    });
  }
  const response = await UserServices.verifyOTP(email, otp);
  return res.status(response.status).json(response);
};

const handleRegister = async (req, res) => {
  const {
    formData: { email, password, tiktokId, birthdate },
  } = req.body;
  console.log(email, password, tiktokId, birthdate);
  if (!email || !password || !tiktokId || !birthdate) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "Email, password, tiktokId and birthdate are required",
    });
  }
  const convertDate = new Date(
    birthdate.year,
    birthdate.month - 1,
    birthdate.day
  );
  const response = await UserServices.register(
    email,
    password,
    tiktokId,
    convertDate
  );
  return res.status(response.status).json(response);
};

const handleLogin = async (req, res) => {
  const {
    formData: { email, password },
  } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "Email and password are required",
    });
  }
  const response = await UserServices.login(email, password);
  return res.status(response.status).json(response);
};

const handleSearch = async (req, res) => {
  const { currentTiktokId, keyword, page = 1, limit = 20 } = req.query;
  if (!keyword) {
    return res.status(400).json({
      status: 400,
      code: "NOT_ENOUGH_INFO",
      message: "Keyword is required",
    });
  }
  const response = await UserServices.search(
    currentTiktokId,
    keyword,
    parseInt(page),
    parseInt(limit)
  );
  return res.status(response.status).json(response);
};

const handleGetUserByFollowings = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const { page, limit } = req.query;
  const response = await FollowServices.findFollowByFollowerId(tiktokId);
  if (response.code !== "OK") {
    return res.status(500).json({
      status: 500,
      code: "ERROR",
      message: "Internal server error",
    });
  }
  const followings = response.data.map((follow) => follow.followingId);
  const usersRes = await UserServices.getUserByFollowings(
    followings,
    parseInt(page),
    parseInt(limit)
  );
  return res.status(usersRes.status).json(usersRes);
};

module.exports = {
  handleGetAccountAuth,
  handleGetUserByTiktokId,
  handleSendOTPByMail,
  handleVerifyOTP,
  handleRegister,
  handleLogin,
  handleSearch,
  handleGetUserByFollowings,
};
