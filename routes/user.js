const express = require("express");
const router = express.Router();

// Navigate addUser , userLogin , getUser methods from userController file,
const {
  addUser,
  userLogin,
  getUser,
} = require("../controllers/userController");
const { verifyAuth } = require("../middleware/authUser");

// Create Route to methods
router.post("/addUser", addUser);
router.post("/login", userLogin);
router.get("/profile", verifyAuth, getUser);

module.exports = router;
