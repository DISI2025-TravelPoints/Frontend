import React, { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../requests/WishlistRequests';
import { getAttractionById }           from '../requests/AdminRequests';
import { IoTrashOutline }               from 'react-icons/io5';
import '../styles/WishlistPage.css';

export default function WishlistPage() {
    const [items, setItems] = useState([]);   // array de attraction objects
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const ids = await getWishlist();
                const details = await Promise.all(ids.map(id => getAttractionById(id)));
                setItems(details);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleRemove = async (id) => {
        try {
            await removeFromWishlist(id);
            setItems(prev => prev.filter(a => a.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="wishlist-page">Loading …</div>;
    if (items.length === 0) return <div className="wishlist-page">Your wishlist is empty.</div>;

    return (
        <div className="wishlist-page">
            <h1>Your Wishlist</h1>
            <div className="wishlist-grid">
                {items.map(attr => (
                    <div key={attr.id} className="wishlist-card">
                        <img
                            src={`https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${attr.id}/cover.jpeg`}
                            alt={attr.name}
                        />
                        <div className="wishlist-info">
                            <h3>{attr.name}</h3>
                            <span>entry fee: {attr.entryFee}$</span>
                        </div>
                        <button
                            className="remove-btn"
                            onClick={() => handleRemove(attr.id)}
                        >
                            <IoTrashOutline size={24} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

