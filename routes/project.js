const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectname: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  image:{
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  projectDetails: {
    type: String,
  },
 
  URL: {
    type: String,
  },
});

module.exports = mongoose.model("project", projectSchema);
