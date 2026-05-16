const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,

    // Auto delete after 24 hours
    expires: 86400,
  },
});

module.exports = mongoose.model(
  "Story",
  storySchema
);