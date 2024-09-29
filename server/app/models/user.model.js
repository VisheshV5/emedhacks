const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fName: { type: String },
  lName: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  details: {},
  age: { type: Number },
  role: { type: String },
  preferences: {},
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  illnesses: {},
});

const User = mongoose.model("User", userSchema);
module.exports = User;
