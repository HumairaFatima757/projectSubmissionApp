const mongoose = require("mongoose");

const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/instagramclone");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  projects:[{

    
  }],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },
  password: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user"
  }
});

userSchema.plugin(plm)

module.exports = mongoose.model("User", userSchema);
