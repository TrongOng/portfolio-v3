import axios from "axios";
import { API_URL } from "../config/baseurl";
const API = `${API_URL}/message`;

export interface MessageModel {
  id: number;
  title: string;
  name: string;
  email: string;
  message: string;
  is_open: boolean;
  is_favorite: boolean;
  created_at: string;
}

// Function to send a new message to the database, excluding the "id", "is_open", "is_favorite"
export const createMessage = async (
  data: Omit<MessageModel, "id" | "is_open" | "is_favorite" | "created_at">
): Promise<MessageModel> => {
  try {
    const result = await axios.post<MessageModel>(API, data);
    return result.data;
  } catch (error) {
    console.error("Error creating message", error);
    throw error;
  }
};

// get messages by descending + pagination
export const getMessages = async (
  page: number,
  items_per_page: number
): Promise<[MessageModel[], number]> => {
  try {
    const response = await axios.get<[MessageModel[], number]>(API, {
      params: {
        page: page,
        items_per_page: items_per_page,
      },
    });
    // Accessing data directly without the 'data' wrapper
    return response.data; // Extracting data from the response
  } catch (error) {
    console.error("Error fetching messages", error);
    throw error;
  }
};

// Function to get single message
export const getMessage = async (id: number): Promise<MessageModel> => {
  try {
    const response = await axios.get<MessageModel>(`${API}/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching message", error);
    throw error;
  }
};

// Function to set is_favorite
export const setFavoriteMessages = async (
  id: number,
  is_favorite: boolean
): Promise<MessageModel> => {
  try {
    const response = await axios.put<MessageModel>(`${API}/is_favorite/${id}`, {
      is_favorite,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating message to is_favorite", error);
    throw error;
  }
};
