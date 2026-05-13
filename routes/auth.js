const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        username: req.body.username,
        password: hash
    });
    await user.save();
    res.json("User Registered");
});

// LOGIN
router.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.json("User not found");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.json("Wrong password");

    res.json("Login success");
});

module.exports = router;