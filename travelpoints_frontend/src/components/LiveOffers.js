import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { getUserIdFromToken } from '../utils/Auth';

const LiveOffers = () => {
    const [offers, setOffers] = useState([]);
    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!userId) {
            console.warn('User not authenticated');
            return;
        }

        console.log("🟡 Initializing WebSocket...");

        const socket = new SockJS('http://localhost:8082/ws-offers');
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            console.log('Connected to WebSocket');

            stompClient.subscribe(`/topic/offers/${userId}`, (message) => {
                const offer = JSON.parse(message.body);
                console.log('Received offer:', offer);
                setOffers(prev => {
                    const alreadyExists = prev.some(o => o.id === offer.id);
                    return alreadyExists ? prev : [...prev, offer];
                });
            });
        });

        return () => {
            console.log("Disconnecting WebSocket...");
            if (stompClient.connected) {
                stompClient.disconnect(() => console.log('🟠 WebSocket disconnected.'));
            }
        };
    }, [userId]);


    return (
        <div>
            <h2>Live Offers</h2>
            {offers.length === 0 && <p>No offers yet.</p>}
            <ul>
                {offers.map((offer, index) => (
                    <li key={index}>
                        <strong>{offer.title}</strong> – {offer.description} (valid until {offer.validUntil})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LiveOffers;
