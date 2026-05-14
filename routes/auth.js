const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    res.json({ success: true, user: username });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;