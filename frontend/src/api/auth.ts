import axios from "axios";
import { API_URL } from "../config/baseurl";
const API = `${API_URL}/user`;

export const login = async (email: string, password: string): Promise<any> => {
  const result = await axios.post(`${API}/login`, {
    email,
    password,
  });
  console.log(result);
  return result.data;
};

export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const result = await axios.post(`${API}/password/forgot`, email);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  new_password: string
): Promise<any> => {
  try {
    const result = await axios.post(`${API}/password/reset`, {
      token,
      new_password,
    });
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
