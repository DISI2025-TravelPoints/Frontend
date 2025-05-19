import React, { useEffect, useState } from 'react';
import { getTopRatedAttractions } from '../requests/reviewApi';
import { FaStar } from 'react-icons/fa';

const TopAttractions = () => {
  const [topAttractions, setTopAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getTopRatedAttractions();
        setTopAttractions(data);
      } catch (err) {
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌟 Top Attractions</h2>
      <ul style={styles.list}>
        {topAttractions.map((attr, index) => (
          <li key={attr.attractionId} style={styles.listItem}>
            <span style={styles.rank}>#{index + 1}</span>
            <span style={styles.name}>{attr.name}</span>
            <span style={styles.rating}>
              <FaStar color="gold" style={{ marginRight: '5px' }} />
              {attr.averageRating.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#333',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #eee',
  },
  rank: {
    fontWeight: 'bold',
    color: '#6366f1',
  },
  name: {
    flex: 1,
    marginLeft: '10px',
    fontSize: '1rem',
    color: '#111827',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
    color: '#f59e0b',
  },
  loading: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center',
    marginTop: '2rem',
    color: 'red',
  },
};

export default TopAttractions;
