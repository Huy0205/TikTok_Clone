import { memo, useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './VideoItem.module.scss';
import VideoSibar from './VideoSidebar';
import VideoFooter from './VideoFooter';
import { VideoContext } from '~/contexts/VideoContext';
import { useHLS } from '~/hooks';
import { getVideoOrientation } from '~/util/videoOrientation';

const cx = classNames.bind(styles);

function VideoItem({ data, isLast, lastVideoElementRef }) {
    const [videoOrientation, setVideoOrientation] = useState(null);
    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(true);

    const { isMuted, volume } = useContext(VideoContext);

    const videoRef = useRef();

    useHLS(videoRef, data.hls_url);

    useEffect(() => {
        if (data.width && data.height) {
            const orientation = getVideoOrientation(data.width, data.height);
            setVideoOrientation(orientation);
        }
    }, [data.width, data.height]);

    useEffect(() => {
        const handlePlay = () => {
            if (videoRef.current && videoRef.current.paused) {
                videoRef.current
                    .play()
                    .then(() => console.log('playing'))
                    .catch(() => console.log('error'));
            }
        };

        const handlePause = () => {
            if (videoRef.current && !videoRef.current.paused) {
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
            observer.observe(videoElement);
        }

        return () => {
            if (videoElement) {
                observer.unobserve(videoElement);
            }
        };
    }, [videoRef]);

    useEffect(() => {
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.volume = 0;
            } else {
                videoRef.current.volume = volume;
            }
        }
    }, [isMuted, volume]);

    const getThumbnailUrl = (videoUrl) => {
        if (!videoUrl) return '';

        return videoUrl.replace('/video/upload/sp_hd/', '/video/upload/so_0/').replace('.m3u8', '.jpg');
    };

    return (
        <div className={cx('video-item-wrapper', videoOrientation)} ref={isLast ? lastVideoElementRef : null}>
            <div
                className={cx('video-item-container')}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <video
                    ref={videoRef}
                    className={cx('video')}
                    muted={isMuted}
                    poster={getThumbnailUrl(data.hls_url)}
                    loop
                    preload="auto"
                    playsInline
                    onLoadedData={() => setLoading(false)}
                />
                {!loading && (
                    <VideoFooter
                        videoRef={videoRef}
                        hoverVideo={hover}
                        publisherId={data.publisherId}
                        music={data.music}
                        title={data.title}
                    />
                )}
            </div>
            <VideoSibar videoId={data._id} publisherId={data.publisherId} shares={data.shares} />
        </div>
    );
}

VideoItem.propTypes = {
    data: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    lastVideoElementRef: PropTypes.func.isRequired,
};

export default memo(VideoItem);
