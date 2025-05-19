import React, { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import { getUserIdFromToken } from '../utils/Auth';
import { getAttractionById } from '../requests/AdminRequests';
import { FiBell } from 'react-icons/fi';
import '../styles/LiveOfferToast.css';

const LiveOffersToast = () => {
    const shownIds  = useRef(new Set());
    const subRef    = useRef(null);
    const clientRef = useRef(null);
    const userId = getUserIdFromToken();

    useEffect(() => {
        if (!userId) return;

        const socket       = new SockJS('http://localhost:8082/ws-offers');
        // const socket = new SockJS('http://localhost/ws-offers');
        const stompClient  = Stomp.over(socket);
        clientRef.current  = stompClient;

        stompClient.connect({}, () => {
            subRef.current = stompClient.subscribe(
                `/topic/offers/${userId}`,
                async ({ body }) => {
                    const offer = JSON.parse(body);
                    if (shownIds.current.has(offer.id)) return;
                    shownIds.current.add(offer.id);

                    /* ——— nume atractie ——— */
                    let attraction = { name: 'attraction' };
                    try {
                        attraction = await getAttractionById(offer.attractionId);
                    } catch {
                        console.warn('Failed to fetch attraction name');
                    }

                    /* ———afisare toast ——— */
                    toast(
                        <div className="toast-offer-container">
                            <div className="toast-offer-header">
                                <FiBell className="toast-bell-icon"/>
                                <span className="toast-offer-highlight">
                  New Limited Offer on <strong>{attraction.name}</strong>
                </span>
                            </div>

                            <div className="toast-offer-title">{offer.title}</div>
                            <div className="toast-offer-description">{offer.description}</div>
                            <div className="toast-offer-valid">
                                Valid until: {new Date(offer.validUntil).toLocaleDateString('ro-RO')}
                            </div>
                        </div>,
                        {
                            position: 'top-right',
                            autoClose: 8000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            closeButton: true,
                            pauseOnHover: true,
                            toastClassName: 'custom-toast'
                        }
                    );

                    // /* marchează “missed” dacă fereastra nu are focus */
                    // if (!document.hasFocus()) {
                    //     localStorage.setItem('hasOfflineOffers', 'true');
                    //     setHasOfflineOffers(true);
                    // }
                }
            );
        });

        /* —— cleanup —— */
        return () => {
            if (subRef.current) subRef.current.unsubscribe();
            if (clientRef.current?.connected) clientRef.current.disconnect();
        };
    }, [userId]);

    return null;
};

export default LiveOffersToast;


