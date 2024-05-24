import axios from "axios";
import { API_URL } from "../config/baseurl";

export const login = async (email: string, password: string) => {
  const result = await axios.post(`${API_URL}/user/login`, {
    email,
    password,
  });
  return result.data;
};
