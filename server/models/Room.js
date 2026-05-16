const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: String,
  type: {
    type: String,
    enum: ["public", "private"],
  },
  password: String,
  members: [String],
});

module.exports = mongoose.model("Room", roomSchema);