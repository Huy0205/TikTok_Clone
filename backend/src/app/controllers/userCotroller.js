const { UserServices } = require("../services");

const handleGetAccount = async (req, res) => {
  const {
    user: { tiktokId },
  } = req;
  const response = await UserServices.getUserByTiktokId(tiktokId);
  return res.status(response.status).json(response);
};

const handleSendOTPByMail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: 400,
      message: "Email is required",
    });
  }
  const response = await UserServices.sendOTPByMail(email);
  return res.status(response.status).json(response);
};

const handleVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      status: 400,
      message: "Email and OTP are required",
    });
  }
  const response = await UserServices.verifyOTP(email, otp);
  return res.status(response.status).json(response);
};

const handleRegister = async (req, res) => {
  const { email, password, tiktokId, birthdate } = req.body;
  if (!email || !password || !tiktokId || !birthdate) {
    return res.status(400).json({
      status: 400,
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
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

module.exports = {
  handleGetAccount,
  handleSendOTPByMail,
  handleVerifyOTP,
  handleRegister,
  handleLogin,
  handleSearch,
};
