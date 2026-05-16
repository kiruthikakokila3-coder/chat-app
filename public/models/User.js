const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
  online: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);