import axios from "axios";
import { API_LOCAL_URL } from "../api";

const WL = "/api/wishlist";

const axiosAuth = axios.create({
    baseURL: `http://localhost`,
    headers: { "Content-Type": "application/json" },
});
axiosAuth.interceptors.request.use(cfg => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers["Authorization"] = `Bearer ${token}`;
    return cfg;
});

/* ───── endpoints ───── */
export const getWishlist = () =>
   axiosAuth.get(`${WL}`).then(r => r.data);         // → [uuid]


export const addToWishlist = (id) =>
    axiosAuth.post(`${WL}/add`, null,
        { params: { attractionId: id } });

export const removeFromWishlist = (id) =>
    axiosAuth.delete(`${WL}/remove`,
        { params: { attractionId: id } });

export const getUsersByAttraction = (attractionId) =>
    axiosAuth.get(`/api/wishlist/users-by-attraction/${attractionId}`)
        .then(res => res.data)
        .catch(err => {
            console.error("Error fetching users by attraction:", err);
            return [];
        });

export const sendOffer = (payload) =>
    axiosAuth.post("/api/offers/send", payload)
        .then(r => r.data);






