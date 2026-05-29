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

export type SignupAdminPayload = {
  email: string;
  password: string;
};

export type LoginAdminPayload = {
  email: string;
  password: string;
};

// STUDENT SIGNUP
export const signupStudent = async (data: SignupStudentPayload) => {
  return await axios.post(`${BASE_URL}/signup`, data);
};

// STUDENT LOGIN
export const loginStudent = async (data: LoginStudentPayload) => {
  return await axios.post(`${BASE_URL}/login`, data);
};

// ADMIN SIGNUP
export const signupAdmin = async (data: SignupAdminPayload) => {
  return await axios.post(`${BASE_URL}/admin/signup`, data);
};

// ADMIN LOGIN
export const loginAdmin = async (data: LoginAdminPayload) => {
  return await axios.post(`${BASE_URL}/admin/login`, data);
};
