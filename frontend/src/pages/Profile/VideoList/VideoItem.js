import { useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './VideoList.module.scss';
import { PlayRegularIcon } from '~/components/Icon';
import { useHLS } from '~/hooks';

const cx = classNames.bind(styles);

function VideoItem({ data, setVideoRef, handleMouseEnter }) {
    const videoRef = useRef(null);

    useHLS(videoRef, data.hls_url);

    useEffect(() => {
        if (videoRef.current) {
            setVideoRef(videoRef.current); // Gửi ref về VideoList
        }
    }, [setVideoRef]);

    return (
        <div className={cx('video-item')}>
            <div className={cx('video-container')} onMouseEnter={handleMouseEnter}>
                <video ref={videoRef} muted className={cx('video')} />
                <div className={cx('video-bottom')}>
                    <PlayRegularIcon />
                    <strong>200</strong>
                </div>
            </div>
            <div className={cx('title')}>
                <span>{data.title}</span>
            </div>
        </div>
    );
}

export default VideoItem;
