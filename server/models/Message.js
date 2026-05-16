const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  roomId: String,
  text: String,
  image: String,
  seen: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);