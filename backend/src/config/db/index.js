const mongoose = require("mongoose");

const connectState = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is ${connectState[mongoose.connection.readyState]}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = { connect };
