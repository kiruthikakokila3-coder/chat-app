const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: String,
  password: String,
  type: String, // "private" or "public"
  users: [String] // usernames
});

module.exports = mongoose.model("Room", roomSchema);