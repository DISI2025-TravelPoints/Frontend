import { useState, useRef, useEffect } from 'react';

export function useAudioPlayer(src) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggle = (e) => {
        // stop the Link navigation & any default button behavior
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation)  e.stopPropagation();

        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error('Audio play error:', err));
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', onEnded);
        return () => audio.removeEventListener('ended', onEnded);
    }, []);

    return { audioRef, isPlaying, toggle };
}

