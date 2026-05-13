const router = require("express").Router();
const Room = require("../models/Room");

// CREATE GROUP
router.post("/", async (req, res) => {
    const room = new Room({ name: req.body.name });
    await room.save();
    res.json(room);
});

// GET GROUPS
router.get("/", async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

module.exports = router;