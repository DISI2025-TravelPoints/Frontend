import React, { useEffect, useState , useRef} from 'react';
import { useParams } from 'react-router-dom';
import { getAttractionById } from '../requests/AdminRequests';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import Header from '../components/Header';
import '../styles/AttractionDetails.css';
import { useAudioPlayer } from '../utils/AudioPlayer';
import ContactChat from "../components/user/ContactChat";
import { CiChat2 } from "react-icons/ci";
import { message } from "antd";
import SaveButton from '../components/SaveButton';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from '../requests/WishlistRequests';
import {getRoleFromToken} from "../utils/Auth";
import { getLoggedInUser } from '../api';
import {
    postReview,
    getReviews,
    updateReview,
    deleteReview,
    getAverageRating
} from "../requests/reviewApi";


// -------------------- Subcomponents -------------------- //
//Overview section (left column)
function Overview({ html, audioUrl,id }) {
    const { elementId, isPlaying, toggle } = useAudioPlayer(audioUrl, id);
    return (
        <div className="left-column overview">
            <h2 className="section-title">About</h2>
            <div className="overview-text" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="overview-audio">
                <audio controls>
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support audio.
                </audio>
                <audio id={elementId} preload="auto" src={audioUrl}/>
            </div>
        </div>
    );
}

// Details section (right column)
function Details({html, entryFee}) {
    return (
        <div className="right-column details">
            <h2 className="section-title purple"></h2>
            <div className="details-text" dangerouslySetInnerHTML={{__html: html}}/>
            <div className="details-fee">
                 <strong>Entry fee:</strong> {entryFee}$
            </div>
        </div>
    );
}

function ContactBubble({attractionId, messageApi}){
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
            <div>
                <CiChat2 className="chat-icon" onClick={() => setIsContactModalOpen(true)}>Contact Us</CiChat2>
                <ContactChat isModalOpen={isContactModalOpen} setIsModalOpen={setIsContactModalOpen} attractionId={attractionId} messageApi={messageApi}/>
            </div>);
}

// -------------------- Main Component -------------------- //
export default function AttractionDetails() {
    const {id} = useParams();
    const [attraction, setAttraction] = useState(null);
    const [overviewHtml, setOverviewHtml] = useState('');
    const [detailsHtml, setDetailsHtml] = useState('');
const [messageApi, contextHolder] = message.useMessage();
    const [saved, setSaved] = useState(false);
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setSaved(false);
            return;
        }

        (async () => {
            try {
                const ids = await getWishlist();
                setSaved(ids.includes(id));
            } catch (e) {
                console.error(e);
            }
        })();
    }, [id]);


    const toggleSave = async () => {
        try {
            if (saved) {
                await removeFromWishlist(id);
            } else {
                await addToWishlist(id);
            }
            setSaved(!saved);
        } catch (e) {
            console.error(e);
        }
    };



    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedRating, setEditedRating] = useState(5);
    const [editedComment, setEditedComment] = useState('');



    const fetchReviews = async () => {
        try {
            const [reviewsRes, ratingRes] = await Promise.all([
                getReviews(),
                getAverageRating(id)
            ]);
    
            const attractionReviews = reviewsRes.data
                .filter(r => r.attractionId === id)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
            setReviews(attractionReviews);
            setAvgRating(ratingRes.data);
        } catch (error) {
            console.error("Eroare la încărcarea review-urilor:", error);
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setMessage("Review deleted.");
            await fetchReviews();
        } catch {
            setMessage("Failed to delete.");
        }
    };
    
    const handleUpdate = async (reviewId) => {
        try {
            await updateReview(reviewId, {
                rating: editedRating,
                comment: editedComment,
            });
            setMessage("Review updated.");
            setEditingReviewId(null);
            await fetchReviews();
        } catch {
            setMessage("Failed to update.");
        }
    };
    

    useEffect(() => {
        async function fetchData() {
            const data = await getAttractionById(id);
            // Split description into two parts
            const [ov, dt] = data.description.split('<hr/>');
            setAttraction({
                ...data,
                images: [
                    `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/cover.jpeg`,
                    `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/1.jpeg`,
                    `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/2.jpeg`
                ],
                audioUrl: `https://travelpoints-bucket.s3.amazonaws.com/${data.audioFilePath}`

            });
            setOverviewHtml(ov);
            setDetailsHtml(dt);
            await fetchReviews();
        }

        async function fetchUserId() {
            try {
                const res = await getLoggedInUser();
                setLoggedInUserId(res.data.id);
            } catch (err) {
                console.error("Failed to fetch user ID:", err);
            }
        }
        if (localStorage.getItem("token")) {
            fetchUserId();
          }

        fetchData();
    
    }, [id]);

   
    

    if (!attraction) return <p>Loading...</p>;

    return (
        <div className="details-page">
            {contextHolder}
            <Header className="header-dark-text"/>

            {isLoggedIn && (
                <div className="save-wrapper">
                    <SaveButton saved={saved} onToggle={toggleSave}/>
                </div>
            )}

            <div className="attraction-details-container">
                <h1 className="attraction-name gradient-text">{attraction.name}</h1>

                {/* -------- Swiper Carousel -------- */}
                <Swiper
                    modules={[EffectCoverflow, Pagination]}
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    slidesPerView="auto"
                    slideToClickedSlide
                    initialSlide={Math.floor(attraction.images.length / 2)}
                    pagination={{clickable: true}}
                    coverflowEffect={{rotate: 0, stretch: 0, depth: 100, modifier: 1.5, slideShadows: false}}
                    className="coverflow-swiper"
                >
                    {attraction.images.map((url, idx) => (
                        <SwiperSlide key={idx} style={{width: '480px'}}>
                            <img src={url} alt={`Slide ${idx}`} className="swiper-image"/>
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>

            <div className="attraction-text-wrapper">
                <div className="description-section">
                    <Overview html={overviewHtml} audioUrl={attraction.audioUrl}/>
                    {/*<Details html={detailsHtml}/>*/}
                    <Details html={detailsHtml} entryFee={attraction.entryFee} />

                </div>
                <div className="review-section enhanced">
                    <h2 className="review-title">📝 Visitor Reviews</h2>
                    {avgRating !== null && (
                        <p className="avg-rating">⭐ <strong>Average:</strong> {avgRating.toFixed(1)} / 5</p>
                    )}

                    {localStorage.getItem("token") ? (
                        <form className="review-form" onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                                await postReview({ attractionId: id, rating, comment });
                                setMessage("✅ Review posted successfully!");
                                setComment('');
                                setRating(5);
                                await fetchReviews();
                            } catch (err) {
                                setMessage("❌ Error submitting review.");
                            }
                        }}>
                            <label>Rating (1-5):</label>
                            <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} required />
                            <label>Comment:</label>
                            <textarea placeholder="Share your thoughts..." maxLength={300} value={comment} onChange={(e) => setComment(e.target.value)} />
                            <button type="submit">Submit Review</button>
                        </form>
                    ) : (
                        <p className="login-prompt">🔐 Please Login to leave a review.</p>
                    )}

                    {message && <p className="status-message">{message}</p>}

                    <div className="reviews-list">
                        {reviews.map((r) => (
                            <div key={r.id} className="review-item">
                                <p><strong>{r.username}</strong> rated it {r.rating}/5</p>
                                {r.comment && <p>{r.comment}</p>}
                                <small>{new Date(r.createdAt).toLocaleString()}</small>

                                {Number(loggedInUserId) === Number(r.userId) && (
                                    <div className="review-actions">
                                        <button onClick={() => {
                                        setEditingReviewId(r.id);
                                        setEditedRating(r.rating);
                                        setEditedComment(r.comment || '');
                                        }}>
                                        Edit
                                        </button>
                                        <button onClick={() => handleDelete(r.id)}>Delete</button>
                                    </div>
                                )}


                                {editingReviewId === r.id && (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdate(r.id);
                                    }}>
                                        <label>Rating:</label>
                                        <input
                                            type="number"
                                            min={1}
                                            max={5}
                                            value={editedRating}
                                            onChange={(e) => setEditedRating(Number(e.target.value))}
                                        />
                                        <label>Comment:</label>
                                        <textarea
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                        />
                                        <button type="submit">Save</button>
                                        <button type="button" onClick={() => setEditingReviewId(null)}>Cancel</button>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        
                    <div className = "attraction-contact-bubble">
                        <ContactBubble attractionId={id} messageApi={messageApi}/>
                    </div>

        </div>
);
}
