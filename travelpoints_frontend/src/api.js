import axios from "axios";

const userApi = axios.create({
    // baseURL: "http://localhost:8081",
    baseURL: "http://localhost:80",
    headers: {
        "Content-Type": "application/json"
    }
});

// userApi.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//
//         const isAuthEndpoint = config.url.includes("/login") || config.url.includes("/register");
//         if (!isAuthEndpoint && token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        // 🔥 EXTINDEM endpoint-urile care NU cer token
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
