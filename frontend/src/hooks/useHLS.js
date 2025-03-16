import { useEffect } from 'react';
import Hls from 'hls.js';

const useHLS = (videoRef, hlsUrl) => {
    useEffect(() => {
        console.log('videoRef.current', videoRef.current);
        console.log('hlsUrl', hlsUrl);
        if (!videoRef.current || !hlsUrl) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(hlsUrl);
            hls.attachMedia(videoRef.current);

            return () => hls.destroy();
        } else {
            videoRef.current.src = hlsUrl;
        }
    }, [hlsUrl, videoRef]);
};

export default useHLS;
