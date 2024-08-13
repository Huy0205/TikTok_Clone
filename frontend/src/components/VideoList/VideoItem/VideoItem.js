import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './VideoItem.module.scss';
import VideoSibar from './VideoSidebar';
import VideoFooter from './VideoFooter';
import { VideoContext } from '~/contexts/VideoContext';

const cx = classNames.bind(styles);

function VideoItem({ data }) {
    const [classes, setClasses] = useState(cx('video-item-wrapper'));
    const [hover, setHover] = useState(false);

    const { isMuted } = useContext(VideoContext);

    const videoRef = useRef();

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
            if (videoRef.current) {
                videoRef.current
                    .play()
                    .then(() => console.log('playing'))
                    .catch(() => console.log('error'));
            }
        };

        const handlePause = () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        handlePlay();
                    } else {
                        handlePause();
                        if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                        }
                    }
                });
            },
            {
                rootMargin: '-160px 0px -160px 0px',
                threshold: 0.5,
            },
        );

        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                observer.unobserve(videoElement);
            }
        };
    }, [videoRef]);

    return (
        <div className={classes}>
            <div
                className={cx('video-item-container')}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <video
                    ref={videoRef}
                    className={cx('video')}
                    src={data.src}
                    muted={isMuted}
                    loop
                    preload="auto"
                    playsInline
                />
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
