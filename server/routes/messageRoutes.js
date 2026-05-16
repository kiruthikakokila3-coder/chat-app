const router = require("express").Router();

const {
  sendMessage,
  getMessages,
  deleteMessage,
  markSeen,
} = require("../controllers/messageController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

/* =========================
   SEND MESSAGE
========================= */

router.post(
  "/send",
  authMiddleware,
  sendMessage
);

/* =========================
   GET ROOM MESSAGES
========================= */

router.get(
  "/:roomId",
  authMiddleware,
  getMessages
);

/* =========================
   DELETE MESSAGE
========================= */

router.delete(
  "/delete/:id",
  authMiddleware,
  deleteMessage
);

/* =========================
   MARK MESSAGE AS SEEN
========================= */

router.put(
  "/seen/:id",
  authMiddleware,
  markSeen
);

module.exports = router;