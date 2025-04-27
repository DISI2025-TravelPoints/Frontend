import axios from "axios";

export const API_DEPLOY_URL= "http://travelpoints.ddns.net"
export const API_LOCAL_URL= "http://localhost"
const userApi = axios.create({
    //baseURL: "http://localhost:8081",
    baseURL: "http://localhost:80",
    headers: {
        "Content-Type": "application/json"
    }
});

export default userApi;
