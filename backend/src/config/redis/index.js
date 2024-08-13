const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    reconnectStrategy: (retries) => {
      if (retries > 2) {
        return new Error("Retry attempts exhausted");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (error) => {
  console.log("Redis error: ", error);
});

const connect = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connect, redisClient };
