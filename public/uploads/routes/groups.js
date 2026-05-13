const router = require("express").Router();
const Room = require("../models/Room");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

router.post("/create", auth, async (req, res) => {
  const room = await Room.create(req.body);
  res.json(room);
});

module.exports = router;