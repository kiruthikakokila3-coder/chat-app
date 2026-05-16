const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  const room = await Room.create(req.body);
  res.json(room);
};

exports.joinRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room.type === "private" && room.members.length >= 2) {
    return res.status(400).json({
      message: "Private room full",
    });
  }

  room.members.push(req.body.username);

  await room.save();

  res.json(room);
};