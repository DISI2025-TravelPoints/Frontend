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

function ContactBubble({attractionId}){
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
            <div>
                <CiChat2 className="chat-icon" onClick={() => setIsContactModalOpen(true)}>Contact Us</CiChat2>
                <ContactChat isModalOpen={isContactModalOpen} setIsModalOpen={setIsContactModalOpen} attractionId={attractionId}/>
            </div>);
}

// -------------------- Main Component -------------------- //
export default function AttractionDetails() {
    const { id } = useParams();
    const [attraction, setAttraction] = useState(null);
    const [overviewHtml, setOverviewHtml] = useState('');
    const [detailsHtml, setDetailsHtml] = useState('');

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
        }
        fetchData();
    }, [id]);

    if (!attraction) return <p>Loading...</p>;

    return (
        <div className="details-page">
            <Header className="header-dark-text"/>
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
            </div>
        
                    <div className = "attraction-contact-bubble">
                        <ContactBubble attractionId={id}/>
                    </div>

        </div>
);
}
