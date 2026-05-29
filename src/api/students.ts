import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getStudents = async () => {
  return await axios.get(`${BASE_URL}/students`);
};
