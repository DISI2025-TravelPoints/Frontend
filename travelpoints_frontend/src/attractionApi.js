import axios from "axios";

const attractionApi = axios.create({
    baseURL: "http://localhost:80",
    headers: {
        "Content-Type": "application/json"
    }
});

export default attractionApi;
