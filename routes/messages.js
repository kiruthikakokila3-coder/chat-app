const router = require("express").Router();
const Message = require("../models/Message");

// SAVE
router.post("/", async (req, res) => {
  const msg = new Message(req.body);
  await msg.save();
  res.json(msg);
});

// GET
router.get("/:room", async (req, res) => {
  const msgs = await Message.find({ room: req.params.room });
  res.json(msgs);
});

module.exports = router;