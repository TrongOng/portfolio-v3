import axios from "axios";
import { API_URL } from "../config/baseurl";
const API = `${API_URL}/recaptcha`;

export interface recaptchaModel {
  recaptchaToken: string;
}

// post recaptcha token
export const verifyRecaptcha = async (
  data: recaptchaModel
): Promise<recaptchaModel> => {
  try {
    const result = await axios.post<recaptchaModel>(
      `${API}/verify-recaptcha`,
      data
    );
    return result.data;
  } catch (error) {
    console.error("Error verifying reCAPTCHA", error);
    throw error;
  }
};
