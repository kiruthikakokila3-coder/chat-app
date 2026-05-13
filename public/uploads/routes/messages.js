const router = require("express").Router();
const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");

// PRIVATE
router.get("/private/:id", auth, async (req, res) => {
  const msgs = await Message.find({
    $or: [
      { sender: req.user.id, receiver: req.params.id },
      { sender: req.params.id, receiver: req.user.id },
    ],
  });

  res.json(msgs);
});

// GROUP
router.get("/group/:id", auth, async (req, res) => {
  const msgs = await Message.find({ roomId: req.params.id });
  res.json(msgs);
});

module.exports = router;