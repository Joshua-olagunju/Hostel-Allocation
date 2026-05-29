const Student = require("../models/Student");

// GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getAllStudents };
