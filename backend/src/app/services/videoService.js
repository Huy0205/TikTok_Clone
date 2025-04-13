const { cloudinary } = require("../../config");
const Video = require("../models/video");
const { Readable } = require("stream");
const { emitOne } = require("../../socket");

/**
 * @param { ID của người dùng đang đăng nhập } watcherId
 * @param { Mảng chứa các ID của video mà người dùng đã xem (xem tối thiểu 50%) } watchHistorys
 * @param { Mảng chứa các ID của video mà người dùng đã like } likes
 * @param { Trang hiển thị } page
 * @param { Kích thước trang } limit
 * @returns { Mảng chứa các video được gợi ý }
 */
const recommendedVideos = async (
  watcherId,
  watchHistorys = [],
  likes = [],
  saves = [],
  page = 1,
  limit = 10
) => {
  console.log("likes, saves:", likes, saves);
  try {
    const videos = await Video.aggregate([
      {
        $match: {
          $and: [
            { publisherId: { $ne: watcherId } },
            { _id: { $nin: watchHistorys } },
            { _id: { $nin: likes } },
            { _id: { $nin: saves } },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
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

const getVideoByFollowing = async (
  followings,
  page = 1,
  limit = 10,
  sort = -1
) => {
  try {
    const videos = await Video.aggregate([
      {
        $match: {
          publisherId: { $in: followings },
        },
      },
      {
        $sort: { createdAt: sort },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
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

const getVideoByPublisherId = async (publisherId, page, limit, sort) => {
  try {
    let moreQuery = [];
    if (page && limit && sort) {
      moreQuery = [
        { $sort: { createdAt: sort } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];
    }

    const videos = await Video.aggregate([
      { $match: { publisherId } },
      ...moreQuery,
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
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


const getVideoUserLikedOrSaved = async (
  likesOrSaves,
  page = 1,
  limit = 10,
  sort = -1
) => {
  try {
    const videos = await Video.aggregate([
      {
        $match: {
          _id: { $in: likesOrSaves },
        },
      },
      {
        $sort: { createdAt: sort },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    return {
      status: 200,
      code: "OK",
      data: videos,
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

const getVideoByHash = async (hash) => {
  try {
    const videos = await Video.find({ hash }).sort({ createdAt: 1 }).limit(1);
    return {
      status: 200,
      code: "OK",
      data: videos.length > 0 ? videos[0] : null,
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

const getVideoByHashAndPublisherId = async (hash, publisherId) => {
  try {
    const videos = await Video.find({ hash, publisherId })
      .sort({ createdAt: 1 })
      .limit(1);
    return {
      status: 200,
      code: "OK",
      data: videos.length > 0 ? videos[0] : null,
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

/**
 * Upload file lên Cloudinary
 * @param {string} filePath - Đường dẫn tệp cần upload
 * @returns {Promise<Object>} - Thông tin tệp upload
 */
const uploadVideo = async (fileBuffer, hash, tiktokId) => {
  try {
    let uploadedBytes = 0;
    const fileSize = fileBuffer.length;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "TikTok_Clone/videos",
          resource_type: "video",
          chunk_size: 10 * 1024 * 1024,
          eager: [{ streaming_profile: "hd", format: "m3u8" }],
          eager_async: true, // Không block request, xử lý HLS sau
        },
        async (error, result) => {
          if (error) {
            console.error("Lỗi upload:", error);
            emitOne(tiktokId, "uploadProgress", { progress: 20 });
            return reject({
              status: 500,
              code: "ERROR",
              message: "Upload failed",
            });
          }

          let progress = 90;
          console.log("Upload thành công, chờ xử lý HLS...");
          emitOne(tiktokId, "uploadProgress", { progress });

          // Kiểm tra trạng thái HLS mỗi 5 giây
          const checkHLS = setInterval(async () => {
            try {
              const info = await cloudinary.api.resource(result.public_id, {
                resource_type: "video",
              });

              const hlsFile = info?.derived?.find((d) =>
                d.secure_url.endsWith(".m3u8")
              );

              if (hlsFile) {
                clearInterval(checkHLS);
                console.log("HLS hoàn tất!");
                emitOne(tiktokId, "uploadProgress", { progress: 100 });

                resolve({
                  status: 200,
                  code: "OK",
                  data: {
                    cloudinary_public_id: result.public_id,
                    original_url: result.secure_url, // Link MP4
                    hls_url: hlsFile.secure_url, // Đúng file .m3u8
                    width: result.width,
                    height: result.height,
                    hash,
                  },
                });
              } else {
                if (progress < 99) {
                  progress += 1;
                  emitOne(tiktokId, "uploadProgress", { progress });
                }
              }
            } catch (err) {
              console.error("Lỗi kiểm tra HLS:", err);
            }
          }, 3000);
        }
      );

      // Chia nhỏ buffer thành từng chunk
      const chunkSize = 1024 * 256; // 256KB
      let currentPosition = 0;

      const readableStream = new Readable({
        read() {
          if (currentPosition < fileBuffer.length) {
            const chunk = fileBuffer.slice(
              currentPosition,
              currentPosition + chunkSize
            );
            this.push(chunk);
            uploadedBytes += chunk.length;
            currentPosition += chunkSize;

            const progress = Math.min(
              Math.round((uploadedBytes / fileSize) * 80) + 10,
              90
            );
            emitOne(tiktokId, "uploadProgress", { progress });
          } else {
            this.push(null); // Kết thúc stream
          }
        },
      });

      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error(error);
    return { status: 500, code: "ERROR", message: "Internal server error" };
  }
};

const saveVideo = async (video) => {
  try {
    const videoSaved = await Video.create(video);
    return {
      status: 200,
      code: "OK",
      data: videoSaved,
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
  recommendedVideos,
  getVideoByFollowing,
  getVideoByPublisherId,
  getVideoUserLikedOrSaved,
  getVideoByHash,
  getVideoByHashAndPublisherId,
  uploadVideo,
  saveVideo,
};
