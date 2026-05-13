const router = require("express").Router();

router.post("/chat", (req, res) => {
  const { message } = req.body;

  let reply = "🤖 ";

  if (message.includes("hi")) reply += "Hello bro 😎";
  else if (message.includes("love")) reply += "Love ❤️ is powerful";
  else reply += "You said: " + message;

  res.json({ reply });
});

module.exports = router;