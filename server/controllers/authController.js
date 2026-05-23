const Student = require("../models/Student");

// ==========================
// SIGNUP CONTROLLER
// ==========================
const signupStudent = async (req, res) => {
  try {
    const { name, email, password, matricNo } = req.body;

    // 1. check if student already exists
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    // 2. create new student
    const newStudent = await Student.create({
      name,
      email,
      password,
      matricNo,
    });

    // 3. return success response
    res.status(201).json({
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================
// LOGIN CONTROLLER
// ==========================

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check if student exists
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        message: "There is no student associated with this account.",
      });
    }

    // 2. check password
    if (student.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // 3. check payment status
    if (student.paymentStatus !== "paid") {
      return res.status(403).json({
        message:
          "You have not paid school fees, please pay to access the system",
      });
    }

    // 4. success login
    res.status(200).json({
      message: "Login successful, Please wait",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { signupStudent, loginStudent };
