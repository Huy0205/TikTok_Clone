const nodeMailer = require("nodemailer");
const {
  redis: { redisClient },
} = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const getUserByTiktokId = async (tiktokId) => {
  try {
    const user = await User.findOne({ tiktokId }).exec();
    if (!user) {
      return {
        status: 404,
        code: "USER_NOT_FOUND",
        message: "User not found",
      };
    }
    return {
      status: 200,
      data: {
        tiktokId: user.tiktokId,
        nickname: user.nickname,
        email: user.email,
        birthdate: user.birthdate,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    return {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  }
};

const sendOTPByMail = async (email) => {
  try {
    const user = await User.findOne({ email }).exec();
    if (user) {
      return {
        status: 400,
        code: "EMAIL_ALREADY_EXISTS",
        message: "This email is already associated with an account.",
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"TikTok Clone" <${process.env.EMAIL}>`,
      to: email,
      subject: `${otp} là mã xác minh của bạn`,
      html:
        "<div style='background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif;'>" +
        "<h1>Mã xác minh</h1>" +
        "<p style='font-size:16px'>Để xác minh tài khoản của bạn hãy nhập mã này vào TikTok:</p>" +
        `<h2>${otp}</h2>` +
        "<p style='font-size:16px'>Mã xác minh hết hạn sau 48 giờ.</p>" +
        "<p style='font-size:16px'>Nếu bạn không yêu cầu mã, bạn có thể bỏ qua tin nhắn này.</p>" +
        "</div>",
    };

    await transporter.sendMail(mailOptions);
    await redisClient.set(email, otp, "EX", 60 * 60 * 48);
    return {
      status: 200,
      code: "OTP_SENT_SUCCESSFULLY",
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  }
};

const verifyOTP = async (email, otp) => {
  try {
    const otpInRedis = await redisClient.get(email);
    if (otpInRedis === otp) {
      return {
        status: 200,
        code: "OTP_IS_CORRECT",
        message: "OTP is correct",
      };
    }
    if (!otpInRedis) {
      return {
        status: 404,
        code: "OTP_IS_EXPIRED",
        message: "OTP is expired",
      };
    }
    return {
      status: 400,
      code: "OTP_IS_INCORRECT",
      message: "OTP is incorrect",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  }
};

const register = async (email, password, tiktokId, birthdate) => {
  try {
    const userCheck = await User.findOne({ tiktokId }).exec();
    if (userCheck) {
      return {
        status: 400,
        code: "TIKTOKID_IS_EXIST",
        message: "TiktokId is exist",
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      tiktokId,
      nickname: tiktokId,
      email,
      password: hashPassword,
      birthdate,
      avatar: process.env.DEFAULT_AVATAR,
    });

    return {
      status: 200,
      code: "REGISTER_SUCCESSFULLY",
      message: "Register successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return {
        status: 404,
        code: "EMAIL_NOT_EXIST",
        message: "Email not exist",
      };
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        status: 400,
        code: "PASSWORD_INCORRECT",
        message: "Password is incorrect",
      };
    }
    const token = jwt.sign(
      {
        tiktokId: user.tiktokId,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    return {
      status: 200,
      code: "LOGIN_SUCCESSFULLY",
      message: "Login successfully",
      data: {
        token,
        user: {
          tiktokId: user.tiktokId,
          nickname: user.nickname,
          email: user.email,
          birthdate: user.birthdate,
          avatar: user.avatar,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  }
};

const search = async (currentTiktokId, keyword, page, limit) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          tiktokId: { $ne: currentTiktokId },
          $or: [
            { tiktokId: new RegExp(keyword, "i") },
            { nickname: new RegExp(keyword, "i") },
          ],
        },
      },
      {
        $project: {
          tiktokId: 1,
          nickname: 1,
          avatar: 1,
          followers: { $size: "$followers" },
        },
      },
      { $sort: { followers: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]).exec();

    return {
      status: 200,
      code: "SEARCH_SUCCESSFULLY",
      data: users,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    };
  }
};

module.exports = {
  getUserByTiktokId,
  sendOTPByMail,
  verifyOTP,
  register,
  login,
  search,
};
