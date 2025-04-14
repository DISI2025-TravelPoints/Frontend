import axios from "axios";

const userApi = axios.create({
    baseURL: "http://localhost:8081",
    //baseURL: "http://localhost:80",
    headers: {
        "Content-Type": "application/json"
    }
});

// // Interceptor pentru a adăuga tokenul la fiecare request
// userApi.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// userApi.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//
//         // ✅ Nu trimite tokenul dacă e cerere de login sau register
//         if (!config.url.includes("/login") && !config.url.includes("/register") && token) {
//             config.headers["Authorization"] = `Bearer ${token}`;
//         }
//
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// ✅ Interceptor: adaugă tokenul doar dacă NU e login/register
userApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        const isAuthEndpoint = config.url.includes("/login") || config.url.includes("/register");
        if (!isAuthEndpoint && token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);



export default userApi;
