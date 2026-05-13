const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("file"), (req, res) => {
  res.json({ file: req.file.filename });
});

module.exports = router;