import axios from "axios";

export const API_DEPLOY_URL= "http://travelpoints.ddns.net"
export const API_LOCAL_URL= "http://localhost"
const userApi = axios.create({
    // baseURL: "http://localhost:8081",
    baseURL: "http://localhost",
    headers: {
        "Content-Type": "application/json"
    }
});

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        const isPublicEndpoint =
            config.url.includes("/login") ||
            config.url.includes("/register") ||
            config.url.includes("/initiate-password-reset") ||
            config.url.includes("/reset-password") ||
            config.url.includes("/validate-password-reset-token");

        if (!isPublicEndpoint && token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);



export default userApi;
