const nodeMailer = require("nodemailer");
const redisClient = require("../../config/redis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const getUserByTiktokId = async (tiktokId) => {
  try {
    const user = await User.findOne({ tiktokId }).exec();
    if (!user) {
      return {
        status: 404,
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
        message: "Email is exist",
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
    redisClient.set(email, otp, "EX", 60 * 60 * 48);
    return {
      status: 200,
      message: "OTP sent successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "OTP sent failed",
    };
  }
};

const verifyOTP = async (email, otp) => {
  try {
    const otpInRedis = await redisClient.get(email);
    if (otpInRedis === otp) {
      return {
        status: 200,
        message: "OTP is correct",
      };
    }
    if (!otpInRedis) {
      return {
        status: 404,
        message: "OTP is expired",
      };
    }
    return {
      status: 400,
      message: "OTP is incorrect",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Verify OTP failed",
    };
  }
};

const register = async (email, password, tiktokId, birthdate) => {
  try {
    const userCheck = await User.findOne({ tiktokId }).exec();
    if (userCheck) {
      return {
        status: 400,
        message: "TiktokId is exist",
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      tiktokId,
      nickname: tiktokId,
      email,
      password: hashPassword,
      birthdate,
      avatar: process.env.DEFAULT_AVATAR,
    });
    console.log(">>>>>>>>>>.", result);

    return {
      status: 200,
      message: "Register successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Register failed",
    };
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return {
        status: 404,
        message: "Email not exist",
      };
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        status: 400,
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
    return {
      status: 500,
      message: "Login failed",
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
      data: users,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
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
