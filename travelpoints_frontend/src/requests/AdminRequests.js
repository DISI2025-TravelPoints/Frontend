import axios from "axios";
import { API_DEPLOY_URL } from "../api";
import { API_LOCAL_URL } from "../api";
const ATTRACTIONS_API = "/api/attraction";
const CHAT_API = "/api/chat";
//TODO add credentials to axios for admin authorization

export async function getAllAttractions() {
    try {
        let res = await axios.get(`http://localhost${ATTRACTIONS_API}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        console.log(res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching attractions:', error);
        return [];
    }
}

export async function createAttraction(attraction, file) {
    const formData = new FormData();
    //const blob = new Blob([file], {type:'application/octet-stream'});
    formData.append('attraction', new Blob([JSON.stringify(attraction)], { type: 'application/json' }));
    formData.append('file', file);
    const response = await axios.post(`http://localhost${ATTRACTIONS_API}`, formData);
    console.log('Attraction created successfully:', response.data);
    return response;
}

export async function deleteAttraction(attractionId) {
    try {
        const response = await axios.delete(`http://localhost${ATTRACTIONS_API}/${attractionId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        console.log('Attraction deleted successfully:', response.data);
        return response.status;
    } catch (error) {
        console.error('Error deleting attraction:', error);
        return null;
    }
}

export async function updateAttraction(attractionId, updatedAttraction, file) {
    const formData = new FormData();
    formData.append('attraction', new Blob([JSON.stringify(updatedAttraction)], { type: 'application/json' }));

    if (file) {
        formData.append('file', file); // append the file if it exists
    } else {
        formData.append('file', new Blob([], { type: 'application/octet-stream' })); // empty blob
    }

    try {
        const response = await axios.put(`http://localhost${ATTRACTIONS_API}/${attractionId}`, formData);
        return response.status;
    } catch (error) {
        return error.response?.status;
    }
}

export async function getAttractionById(id) {
    try {
        const res = await axios.get(`http://localhost${ATTRACTIONS_API}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return res.data;
    } catch (error) {
        console.error('Error fetching attraction:', error);
        throw error;
    }
}

export async function getVisitFrequencyData(){
    try{
        const res = await axios.get(`${API_LOCAL_URL}${ATTRACTIONS_API}/visit-freq`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return res.data;
    }catch(error){
        console.error('Error fetching visit frequency data: ', error);
        throw error;
    }
}

export async function getEmptyOrAllocatedRooms(email){
    try{
        const res = await axios.get(`${API_LOCAL_URL}${CHAT_API}/get-empty-room`, {
            params: { email }
        });
       return res.data;
    }
    catch(error){
        console.error('Error fetching visit frequency data: ', error);
    }
}

export async function allocateAdminToChatRoom(roomId, email){
    try{
        const res = await axios.post(`${API_LOCAL_URL}${CHAT_API}/join-room/${roomId}`,{}, {
            params: { email }
        });
        return res.data;
    }catch(error){
        console.error(error);
    }
}

export async function fetchChatRoomMessages(roomId){
    try{
        const res = await axios.get(`${API_LOCAL_URL}${CHAT_API}/get-room-messages`,{
            params:{roomId}
        });
        console.log(res.data);
        return res.data;
    }catch(error){
        console.error(error);
    }
}

