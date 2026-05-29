const express = require("express");
const router = express.Router();
const {
  signupStudent,
  loginStudent,
  signupAdmin,
  loginAdmin,
} = require("../controllers/authController");

router.post("/signup", signupStudent);
router.post("/login", loginStudent);
router.post("/admin/signup", signupAdmin);
router.post("/admin/login", loginAdmin);

module.exports = router;
