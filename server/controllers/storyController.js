const Story = require("../models/Story");

/* =========================
   UPLOAD STORY
========================= */

exports.uploadStory = async (req, res) => {
  try {
    const { username, image } = req.body;

    const newStory = await Story.create({
      username,
      image,
    });

    res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   GET ALL STORIES
========================= */

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({
      createdAt: -1,
    });

    res.json(stories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
   DELETE STORY
========================= */

exports.deleteStory = async (req, res) => {
  try {
    await Story.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Story deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};