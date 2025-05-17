import axios from "axios";
import { API_DEPLOY_URL } from "../api";
import { API_LOCAL_URL } from "../api";
const ATTRACTIONS_API = "/api/attraction";
const CHAT_API = "/api/chat";

export async function searchAttractionsByText(searchTerm) {
  try {
    const response = await axios.get(
      `${API_LOCAL_URL}${ATTRACTIONS_API}/search`,
      {
        params: {
          keyword: searchTerm,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status === 404) return [];
    return response.data;
  } catch (error) {
    console.error("Error searching attractions:", error);
    return [];
  }
}

export async function searchAttractionsByCoords(lat, long) {
  try {
    const response = await axios.get(
      `${API_LOCAL_URL}${ATTRACTIONS_API}/search/location`,
      {
        params: {
          latitude: lat,
          longitude: long,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    if (response.status === 404) return [];
    return response.data;
  } catch (error) {
    console.error("Error searching attractions:", error);
    return [];
  }
}

// CHAT REQUESTS
export async function sendContactMessageRequest(message) {
  try {
    const response = await axios.post(
      `${API_LOCAL_URL}${CHAT_API}/create-empty-room`,
      message,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchTouristChatRooms(email){
  try{
        const res = await axios.get(`${API_LOCAL_URL}${CHAT_API}/get-tourist-chat-room`,{
            params: { email }
        });
        console.log(res.data);
        return res.data;
    }catch(error){
        console.error(error);
    }
}
