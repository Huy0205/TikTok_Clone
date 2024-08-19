import classNames from 'classnames';

import VideoItem from './VideoItem';

import styles from './VideoList.module.scss';
import { useRef, useState } from 'react';
import Loading from '~/components/Loading';

function VideoList({ data }) {
    const videoRefs = useRef([]);

    const [currentPlaying, setCurrentPlaying] = useState(null);

    const handleMouseEnter = (videoRef) => {
        if (currentPlaying && currentPlaying !== videoRef) {
            currentPlaying.pause();
            currentPlaying.currentTime = 0;
        }
        videoRef.play();
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
                            videoRef={(el) => (videoRefs.current[index] = el)}
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
