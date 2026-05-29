import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getStudents = async () => {
  return await axios.get(`${BASE_URL}/students`);
};

export type UpdateStudentPayload = {
  paymentStatus?: "paid" | "unpaid";
  roomId?: string | null;
};

export const updateStudent = async (studentId: string, data: UpdateStudentPayload) => {
  return await axios.put(`${BASE_URL}/students/${studentId}`, data);
};
