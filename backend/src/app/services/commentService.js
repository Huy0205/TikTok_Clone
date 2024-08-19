const getCommentByVideoId = async (videoId) => {
  try {
    const comments = await Comment.find({ videoId }).exec();
    return {
      status: 200,
      code: "OK",
      data: comments,
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
