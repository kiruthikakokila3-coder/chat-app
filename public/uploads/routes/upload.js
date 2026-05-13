const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/authMiddleware");


// 📤 SINGLE FILE UPLOAD
router.post("/", auth, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    res.json({
      msg: "File uploaded successfully",
      file: req.file,
      url: `http://localhost:3000/uploads/${req.file.filename}`,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Upload failed" });
  }
});


// 📤 MULTIPLE FILE UPLOAD
router.post("/multiple", auth, upload.array("files", 10), (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ msg: "No files uploaded" });
    }

    const files = req.files.map(file => ({
      name: file.filename,
      url: `http://localhost:3000/uploads/${file.filename}`,
    }));

    res.json({
      msg: "Files uploaded",
      files,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Upload failed" });
  }
});


module.exports = router;