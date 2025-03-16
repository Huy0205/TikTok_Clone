import classNames from 'classnames';
import VideoItem from './VideoItem';
import styles from './VideoList.module.scss';
import { useRef, useState } from 'react';

function VideoList({ data }) {
    const videoRefs = useRef([]); // Dùng useRef để lưu danh sách video

    const [currentPlaying, setCurrentPlaying] = useState(null);

    const handleMouseEnter = (videoRef) => {
        if (!videoRef) return; // Tránh lỗi nếu ref chưa có giá trị

        if (currentPlaying && currentPlaying !== videoRef) {
            currentPlaying.pause();
            currentPlaying.currentTime = 0;
        }

        videoRef.play().catch((error) => console.error('Video play error:', error));
        setCurrentPlaying(videoRef);
    };

    return (
        <>
            {data.length > 0 ? (
                <div className={classNames(styles['list-video'])}>
                    {data.map((video, index) => (
                        <VideoItem
                            key={video._id}
                            data={video}
                            setVideoRef={(el) => {
                                if (el) {
                                    videoRefs.current[index] = el;
                                }
                            }}
                            handleMouseEnter={() => handleMouseEnter(videoRefs.current[index])}
                        />
                    ))}
                </div>
            ) : (
                <div className={classNames(styles['empty-list'])}>No video found</div>
            )}
        </>
    );
}

export default VideoList;
