const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      default: "Hey there! I am using Find Love ❤️",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    contacts: [
      {
        type: String, // userId list
      },
    ],

    blockedUsers: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);


// 🔐 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// 🔑 PASSWORD CHECK METHOD
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


// 🟢 SET ONLINE
userSchema.methods.setOnline = function () {
  this.isOnline = true;
  return this.save();
};

// 🔴 SET OFFLINE
userSchema.methods.setOffline = function () {
  this.isOnline = false;
  this.lastSeen = new Date();
  return this.save();
};


// ➕ ADD CONTACT
userSchema.methods.addContact = function (userId) {
  if (!this.contacts.includes(userId)) {
    this.contacts.push(userId);
  }
  return this.save();
};


// 🚫 BLOCK USER
userSchema.methods.blockUser = function (userId) {
  if (!this.blockedUsers.includes(userId)) {
    this.blockedUsers.push(userId);
  }
  return this.save();
};


// 🚀 EXPORT
module.exports = mongoose.model("User", userSchema);