const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const Admin = require("../models/Admin");

// ==========================
// SIGNUP CONTROLLER
// ==========================
const signupStudent = async (req, res) => {
  try {
    const { name, email, password, matricNo } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = await Student.create({
      name,
      email,
      password: hashedPassword,
      matricNo,
    });

    const studentResponse = newStudent.toObject();
    delete studentResponse.password;

    res.status(201).json({
      message: "Student created successfully",
      student: studentResponse,
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
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        message: "There is no student associated with this account.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, student.password);
    if (!passwordMatches && student.password !== password) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    if (student.paymentStatus !== "paid") {
      return res.status(403).json({
        message:
          "You have not paid school fees, please pay to access the system",
      });
    }

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(200).json({
      message: "Login successful, Please wait",
      student: studentResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================
// ADMIN CONTROLLERS
// ==========================
const signupAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      message: "Admin account created successfully",
      admin: adminResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        message: "There is no admin account associated with this email.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(200).json({
      message: "Admin login successful",
      admin: adminResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { signupStudent, loginStudent, signupAdmin, loginAdmin };
