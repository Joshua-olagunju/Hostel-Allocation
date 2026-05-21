const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  matricNo: String,
  paymentStatus: {
    type: String,
    default: "unpaid",
  },
  roomId: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Student", studentSchema);
