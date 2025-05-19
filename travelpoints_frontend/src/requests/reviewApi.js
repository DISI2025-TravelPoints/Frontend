import axios from "axios";

const reviewApi = axios.create({
    baseURL: "http://localhost/api/review",
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor JWT
reviewApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export const postReview = (review) => reviewApi.post("", review);

export const getReviews = () => reviewApi.get("/all");

export const updateReview = (reviewId, updatedData) =>
    reviewApi.put(`/${reviewId}`, updatedData);

export const deleteReview = (reviewId) =>
    reviewApi.delete(`/${reviewId}`);

export const getAverageRating = (attractionId) =>
    reviewApi.get(`/average-rating/${attractionId}`);

export const getReviewFrequencyStats = () =>
    reviewApi.get("/analytics/visits").then((res) => res.data);
  
export default reviewApi;
