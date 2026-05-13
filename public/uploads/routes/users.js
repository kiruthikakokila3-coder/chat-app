const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  isOnline: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);