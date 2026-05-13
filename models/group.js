const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: String,
  isPrivate: Boolean,
  password: String
});

module.exports = mongoose.model("Group", GroupSchema);