const Message = require("../models/Message");

/* =========================
   SEND MESSAGE
========================= */

exports.sendMessage = async (req, res) => {
  try {
    const {
      sender,
      roomId,
      text,
      image,
    } = req.body;

    const newMessage = await Message.create({
      sender,
      roomId,
      text,
      image,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   GET ROOM MESSAGES
========================= */

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   DELETE MESSAGE
========================= */

exports.deleteMessage = async (
  req,
  res
) => {
  try {
    await Message.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Message deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   SEEN MESSAGE
========================= */

exports.markSeen = async (req, res) => {
  try {
    const message =
      await Message.findByIdAndUpdate(
        req.params.id,
        {
          seen: true,
        },
        {
          new: true,
        }
      );

    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};