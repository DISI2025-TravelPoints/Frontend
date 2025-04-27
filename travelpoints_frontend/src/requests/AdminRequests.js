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