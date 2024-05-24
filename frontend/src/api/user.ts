import axios from "axios";
import { API_URL } from "../config/baseurl";
const API = `${API_URL}/profile`;

export interface UserModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  is_disabled: boolean;
}

export interface UserUpdateModel {
  first_name: string;
  last_name: string;
  email: string;
}

// get user profile
export const getUser = async () => {
  const result = await axios.get<UserModel>(API);
  return result.data;
};

// update user profile
export const updateUser = async (data: UserUpdateModel): Promise<UserModel> => {
  const result: UserModel = await axios.put(API, data);
  return result;
};

// delete user account
export const deleteUser = async () => {
  const result = await axios.delete<UserModel>(API);
  return result.data;
};
