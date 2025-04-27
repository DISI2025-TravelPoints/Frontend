import axios from "axios";
import { API_DEPLOY_URL } from "../api";
import { API_LOCAL_URL } from "../api";
const ATTRACTIONS_API = "/api/attraction";

export async function getAllAttractions() {
    try {
        let res = await axios.get("http://localhost/api/attraction", {
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
    const blob = new Blob([file], {type:'application/octet-stream'});
    formData.append('attraction', new Blob([JSON.stringify(attraction)], { type: 'application/json' }));
    formData.append('file', blob);
    try {
        const response = await axios.post('http://localhost/api/attraction', formData);

        console.log('Attraction created successfully:', response.data);
        return response.status;
    } catch (error) {
        console.error('Error creating attraction:', error);
        return error.response?.status;
    }

}