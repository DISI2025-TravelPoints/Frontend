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
   axiosAuth.get(`${WL}`).then(r => r.data);          // → [uuid]

// export async function getWishlist() {
//     const { data } = await axios.get(`${WL}`, {
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true
//     });
//     // data: array de UUID
//     return data;
// }

export const addToWishlist = (id) =>
    axiosAuth.post(`${WL}/add`, null,
        { params: { attractionId: id } });

export const removeFromWishlist = (id) =>
    axiosAuth.delete(`${WL}/remove`,
        { params: { attractionId: id } });

// export async function removeFromWishlist(attractionId) {
//     // DELETE /api/wishlist/remove?attractionId=...
//     await axios.delete(`${WL}/remove`, {
//         params: { attractionId },
//         headers: { 'Content-Type': 'application/json' },
//         withCredentials: true
//     });
// }

