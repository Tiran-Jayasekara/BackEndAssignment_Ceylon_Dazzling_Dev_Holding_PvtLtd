const mongoose = require("mongoose");

//User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
    },
  },
  { timestamp: true }
);

const User = mongoose.model.User || mongoose.model("User", UserSchema);

module.exports = User;
