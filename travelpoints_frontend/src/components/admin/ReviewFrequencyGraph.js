import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { getReviewFrequencyStats } from "../../requests/reviewApi";

const ReviewFrequencyGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getReviewFrequencyStats()
      .then(setData)
      .catch((err) => {
        console.error("Error loading review stats:", err);
      });
  }, []);

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#2e6a5a" }}>
        Reviews per Attraction
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 14, marginBottom: 10,}}/>
          <Bar dataKey="reviewCount" fill="#43b97f" name="Review Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReviewFrequencyGraph;
