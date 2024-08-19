const { Keyword } = require("../models");

const inscreaseKeywordCount = async (keyword) => {
  try {
    const keywordInstance = await Keyword.findOne({ content: keyword }).exec();

    if (keywordInstance !== null) {
      keywordInstance.count += 1;
      await keywordInstance.save();
    } else {
      await Keyword.create({ content: keyword });
    }
    return {
      status: 200,
      code: "OK",
      message: "Keyword count increased successfully",
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

const search = async (keyword) => {
  try {
    console.log(keyword);
    const keywordInstance = await Keyword.aggregate([
      {
        $match: {
          content: {
            $regex: keyword,
            $options: "i",
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 8,
      },
    ]).exec();
    return {
      status: 200,
      code: "OK",
      data: keywordInstance,
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

module.exports = {
  inscreaseKeywordCount,
  search,
};
