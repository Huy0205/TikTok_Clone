import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './VideoItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh, faVolumeLow, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import { FloatingPlayerIcon, MusicIcon, PauseIcon, PlayIcon } from '~/components/Icon';

const cx = classNames.bind(styles);

function VideoFooter({ videoRef, hoverVideo }) {
    const [hideDescription, setHideDescription] = useState(false);
    const [more, setMore] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(1);
    const [iconVolume, setIconVolume] = useState(faVolumeXmark);
    const [isPlaying, setIsPlaying] = useState(true);

    const descriptionRef = useRef();

    useEffect(() => {
        if (descriptionRef.current) {
            if (descriptionRef.current.scrollWidth > descriptionRef.current.clientWidth) {
                setHideDescription(true);
            }
        }
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const updateProgress = () => {
            if (video) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        video.addEventListener('timeupdate', updateProgress);

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
        };
    }, []);

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = (x / width) * 100;
        setProgress(percent);

        if (videoRef.current) {
            videoRef.current.currentTime = (percent / 100) * videoRef.current.duration;
        }
    };

    const handleVolumeChange = (e) => {
        if (isMuted) {
            videoRef.current.muted = false;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        var percent = 1 - y / height;

        if (percent <= 0.1) {
            percent = 0;
            setIsMuted(true);
            setIconVolume(faVolumeXmark);
        } else if (percent <= 0.6) {
            setIsMuted(false);
            setIconVolume(faVolumeLow);
        } else if (percent <= 1) {
            setIsMuted(false);
            setIconVolume(faVolumeHigh);
        } else {
            percent = 1;
            setIsMuted(false);
            setIconVolume(faVolumeHigh);
        }

        setVolume(percent);

        if (videoRef.current) {
            videoRef.current.volume = percent;
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleOnOffVolume = () => {
        if (isMuted) {
            videoRef.current.muted = false;
            if (volume === 0) {
                videoRef.current.volume = 1;
                setVolume(1);
            }
            setIconVolume(volume < 0.5 ? faVolumeLow : faVolumeHigh);
            setIsMuted(false);
        } else {
            videoRef.current.muted = true;
            setIconVolume(faVolumeXmark);
            setIsMuted(true);
        }
    };

    return (
        <div className={cx('footer')}>
            <div className={cx('link-container')}>
                <Link className={cx('link-tiktokId')} to={`/@`}>
                    <span>huy0205</span>
                </Link>
            </div>
            <div className={cx('description-container')}>
                <div className={cx('description', { more })}>
                    <span className={cx('description-content', { more })} ref={descriptionRef}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit
                        amet consectetur adipisicing elit. Quisquam, quos.
                    </span>
                    {hideDescription && (
                        <div className={cx('more-btn-container')}>
                            <button className={cx('more-btn')} onClick={() => setMore(!more)}>
                                {more ? 'ẩn bớt' : 'thêm'}
                            </button>
                        </div>
                    )}
                </div>
                <div className={cx('music-info')}>
                    <MusicIcon />
                    <span className={cx('music-name')}>Nhạc nền</span>
                </div>
            </div>
            <div className={cx('bottom')}>
                {hoverVideo && (
                    <>
                        <button className={cx('play-btn')} onClick={handlePlayPause}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        <div className={cx('progress-wrapper')}>
                            <div className={cx('progress-container')} onClick={handleProgressClick}>
                                <div className={cx('circle')} style={{ left: `${progress}%` }} />
                                <div className={cx('progress-bar')} style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                        <button className={cx('floating-player-btn')}>
                            <FloatingPlayerIcon />
                        </button>
                    </>
                )}
                <div className={cx('volume-container', { hoverVideo: !hoverVideo })}>
                    <button className={cx('volume-btn')} onClick={handleOnOffVolume}>
                        <FontAwesomeIcon icon={iconVolume} />
                    </button>
                    {!isMuted && (
                        <div className={cx('volume-slider-wrapper')}>
                            <div className={cx('volume-slider')} onClick={handleVolumeChange}>
                                <div className={cx('circle')} style={{ bottom: `${volume * 100}%` }} />
                                <div className={cx('slider-bar')} style={{ height: `${volume * 100}%` }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VideoFooter;
