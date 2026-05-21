import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

export type SignupStudentPayload = {
  name: string;
  email: string;
  password: string;
  matricNo: string;
};

export type LoginStudentPayload = {
  email: string;
  password: string;
};

// SIGNUP
export const signupStudent = async (data: SignupStudentPayload) => {
  return await axios.post(`${BASE_URL}/signup`, data);
};

// LOGIN
export const loginStudent = async (data: LoginStudentPayload) => {
  return await axios.post(`${BASE_URL}/login`, data);
};
