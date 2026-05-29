const express = require("express");
const router = express.Router();
const { getAllStudents, updateStudent } = require("../controllers/studentController");

router.get("/", getAllStudents);
router.put("/:id", updateStudent);

module.exports = router;
