const router = require("express").Router();

const {
  uploadStory,
  getStories,
  deleteStory,
} = require("../controllers/storyController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

/* =========================
   UPLOAD STORY
========================= */

router.post(
  "/upload",
  authMiddleware,
  uploadStory
);

/* =========================
   GET ALL STORIES
========================= */

router.get("/", getStories);

/* =========================
   DELETE STORY
========================= */

router.delete(
  "/delete/:id",
  authMiddleware,
  deleteStory
);

module.exports = router;