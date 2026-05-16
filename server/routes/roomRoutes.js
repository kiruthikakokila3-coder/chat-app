const router = require("express").Router();
const {
  createRoom,
  joinRoom,
} = require("../controllers/roomController");

router.post("/create", createRoom);
router.post("/join/:id", joinRoom);

module.exports = router;