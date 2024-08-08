import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './VideoItem.module.scss';
import { useEffect, useRef, useState } from 'react';
import VideoSibar from './VideoSidebar';
import VideoFooter from './VideoFooter';

const cx = classNames.bind(styles);

function VideoItem({ data }) {
    const videoRef = useRef();
    const [classes, setClasses] = useState(cx('video-item-wrapper'));
    const [hover, setHover] = useState(false);

    useEffect(() => {
        const handleLoadedMetadata = () => {
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;
            if (videoWidth > videoHeight) {
                setClasses(cx('video-item-wrapper', 'horizontal'));
            } else {
                setClasses(cx('video-item-wrapper', 'vertical'));
            }
        };

        const handlePlay = () => {
            if (videoRef.current && isVideoInViewport(videoRef.current, 1 / 2)) {
                videoRef.current
                    .play()
                    .then(() => console.log('playing'))
                    .catch(() => console.log('error'));
            } else {
                videoRef.current.pause();
            }
        };

        const handleScroll = () => {
            if (videoRef.current) {
                handlePlay();
            }
        };

        const isVideoInViewport = (video, threshold) => {
            const rect = video.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * (1 + threshold) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            window.addEventListener('scroll', handleScroll);
            handlePlay();
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, [videoRef]);

    return (
        <div className={classes}>
            <div
                className={cx('video-item-container')}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <video ref={videoRef} className={cx('video')} src={data.src} muted loop preload="auto" playsInline />
                <VideoFooter videoRef={videoRef} hoverVideo={hover} />
            </div>
            <VideoSibar />
        </div>
    );
}

VideoItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default VideoItem;
