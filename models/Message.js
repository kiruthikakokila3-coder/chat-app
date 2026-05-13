const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },

    receiver: {
      type: String, // personal chat user id
      default: null,
    },

    groupId: {
      type: String, // group chat id
      default: null,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    media: {
      type: String, // image / video / audio file path
      default: null,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent",
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // auto create createdAt & updatedAt
  }
);

// 🔍 INDEX (fast query for chats)
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ groupId: 1 });

// 🚀 EXPORT
module.exports = mongoose.model("Message", messageSchema);