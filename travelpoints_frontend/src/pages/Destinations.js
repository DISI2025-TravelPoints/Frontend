import React, { useEffect, useState, useCallback } from 'react';
import AttractionCard   from '../components/AttractionCard';
import AuthPopup        from '../components/AuthPopup';
import '../styles/Destinations.css';
import { getAllAttractions } from '../requests/AdminRequests';
import {
    getWishlist, addToWishlist, removeFromWishlist
} from '../requests/WishlistRequests';

const Destinations = () => {
    const [attractions, setAttractions] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [showPopup , setShowPopup ]   = useState(false);


    useEffect(() => {
        (async () => {
            setAttractions(await getAllAttractions());

            const token = localStorage.getItem("token");
            if (token) {
                try { setWishlistIds(await getWishlist()); }
                catch { /* invalid/expired token => ignore*/ }
            }
        })();
    }, []);


    const handleToggleWishlist = useCallback(async (id, liked) => {
        const token = localStorage.getItem("token");
        if (!token) {                   // not logged → popup
            setShowPopup(true); return;
        }

        try {
            if (liked) {
                await removeFromWishlist(id);
                setWishlistIds(prev => prev.filter(x => x !== id));
            } else {
                await addToWishlist(id);
                setWishlistIds(prev => [...prev, id]);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <>
            {showPopup && <AuthPopup onClose={() => setShowPopup(false)} />}

            <div className="top-destination">
                <div className="top-destination-header">
                    <h4 className="subtitle">Top Destinations</h4>
                    <h2 className="title">Discover your next adventure</h2>
                </div>

                <div className="destination-grid">
                    {attractions.map(a => (
                        <AttractionCard
                            key={a.id}
                            attraction={a}
                            isInWishlist={wishlistIds.includes(a.id)}
                            onToggleWishlist={handleToggleWishlist}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Destinations;
