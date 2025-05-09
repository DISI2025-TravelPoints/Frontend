// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import '../styles/AttractionDetails.css';
//
// const AttractionDetails = () => {
//     const { id } = useParams();
//     const [attraction, setAttraction] = useState(null);
//     const [currentIndex, setCurrentIndex] = useState(0);
//
//     useEffect(() => {
//         // mock sau request real în viitor
//         setAttraction({
//             id,
//             name: 'Sample Attraction',
//             description: 'This is a sample description of the attraction.',
//             images: [
//                 `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/cover.jpeg`,
//                 `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/1.jpeg`,
//                 `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/2.jpeg`
//             ],
//             audioUrl: `https://travelpoints-bucket.s3.amazonaws.com/audio/${id}.wav`
//         });
//         setCurrentIndex(0);
//     }, [id]);
//
//     if (!attraction) return <p>Loading...</p>;
//
//     const { images, name, description, audioUrl } = attraction;
//     const len = images.length;
//
//     const prev = () => setCurrentIndex(i => (i - 1 + len) % len);
//     const next = () => setCurrentIndex(i => (i + 1) % len);
//     const goTo = idx => setCurrentIndex(idx);
//
//     return (
//         <div className="details-page">
//             <nav className="navbar">
//                 <div className="navbar-logo">travelpoints</div>
//             </nav>
//
//             <div className="attraction-details-container">
//                 <h1 className="attraction-name">{name}</h1>
//
//                 <div className="carousel-container">
//                     {images.map((url, idx) => {
//                         const isCurrent = idx === currentIndex;
//                         return (
//                             <img
//                                 key={idx}
//                                 src={url}
//                                 alt={`Slide ${idx}`}
//                                 className={`stacked-image ${isCurrent ? 'current' : 'behind'}`}
//                             />
//                         );
//                     })}
//
//                     <button className="nav-btn prev-btn" onClick={prev}>←</button>
//                     <button className="nav-btn next-btn" onClick={next}>→</button>
//                 </div>
//
//                 <div className="dots-container">
//                     {images.map((_, idx) => (
//                         <span
//                             key={idx}
//                             className={`dot ${idx === currentIndex ? 'active' : ''}`}
//                             onClick={() => goTo(idx)}
//                         />
//                     ))}
//                 </div>
//
//                 <div className="audio-section">
//                     <audio controls>
//                         <source src={audioUrl} type="audio/wav" />
//                         Your browser does not support audio.
//                     </audio>
//                 </div>
//
//                 <p className="attraction-description">{description}</p>
//             </div>
//         </div>
//     );
// };
//
// export default AttractionDetails;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {getAttractionById} from "../requests/AdminRequests";

// Swiper core + modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from '../components/Header';

import '../styles/AttractionDetails.css';
import '../styles/Landing.css';

const AttractionDetails = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [attraction, setAttraction] = useState(null);

    // useEffect(() => {
    //     // mock / fetch real
    //     setAttraction({
    //         id,
    //         name: 'Sample Attraction',
    //         description: 'This is a sample description of the attraction.',
    //         images: [
    //             `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/cover.jpeg`,
    //             `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/1.jpeg`,
    //             `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/2.jpeg`
    //         ],
    //         audioUrl: `https://travelpoints-bucket.s3.amazonaws.com/audio/${id}.wav`
    //
    //         // images: [
    //         //     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    //         //     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    //         //     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
    //         // ]
    //     });
    // }, [id]);

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const data = await getAttractionById(id);
                setAttraction({
                    ...data,
                    images: [
                        `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/cover.jpeg`,
                        `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/1.jpeg`,
                        `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${id}/2.jpeg`
                    ],
                    audioUrl: `https://travelpoints-bucket.s3.amazonaws.com/${data.audioFilePath}`
                });
            } catch (err) {
                console.error("Failed to load attraction:", err);
            }
        };
        fetchAttraction();
    }, [id]);


    if (!attraction) return <p>Loading...</p>;

    return (
        <div className="details-page">
            <Header className="header-dark-text" />
            {/*<nav className="navbar">*/}
            {/*    <div className="navbar-logo">travelpoints</div>*/}
            {/*</nav>*/}


            <div className="attraction-details-container">
                <h1 className="attraction-name">{attraction.name}</h1>

                {/* Swiper Coverflow */}
                <Swiper
                    modules={[EffectCoverflow, Pagination]}
                    effect="coverflow"
                    grabCursor  /*={true} */
                    centeredSlides  /*={true} */
                    slidesPerView="auto"
                    pagination={{clickable: true}}
                    onSwiper={(swiper) => (window.swiperInstance = swiper)}
                    // /* slidesPerView={3}*/
                    //  loop={true}
                    // loopedSlides={attraction.images.length}
                    coverflowEffect={{
                        rotate: 0,      // unghi de rotație
                        stretch: 100,   // distanța de suprapunere
                        depth: 200,     // adâncimea
                        modifier: 1,    // intensitate
                        slideShadows: false,
                    }}
                    //navigation

                    className="coverflow-swiper"
                >
                    {attraction.images.map((url, idx) => (
                        <SwiperSlide key={idx} style={{width: '400px', height: '280px',}}>
                            <img src={url} alt={`Slide ${idx}`} className="swiper-image"/>
                        </SwiperSlide>
                    ))}
                </Swiper>


                {/*<div className="carousel-controls">*/}
                {/*    <button className="arrow" onClick={() => window.swiperInstance.slidePrev()}>&larr;</button>*/}
                {/*    <div className="swiper-pagination"/>*/}
                {/*    <button className="arrow" onClick={() => window.swiperInstance.slideNext()}>&rarr;</button>*/}
                {/*</div>*/}


                <div className="audio-section">
                    <audio controls>
                        <source src={attraction.audioUrl} type="audio/wav"/>
                        Your browser does not support audio.
                    </audio>
                </div>

                {/*<p className="description">{attraction.description}</p>*/}
                <p
                    className="description"
                    style={{whiteSpace: 'pre-line'}}
                    dangerouslySetInnerHTML={{__html: attraction.description}}
                ></p>

            </div>
        </div>
    );
};

export default AttractionDetails;
