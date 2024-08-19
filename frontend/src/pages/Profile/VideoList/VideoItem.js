import classNames from 'classnames/bind';

import styles from './VideoList.module.scss';
import { PlayRegularIcon } from '~/components/Icon';

const cx = classNames.bind(styles);

function VideoItem({ data, videoRef, handleMouseEnter }) {
    return (
        <div className={cx('video-item')}>
            <div className={cx('video-container')} onMouseEnter={handleMouseEnter}>
                <video ref={videoRef} src={data.url} muted className={cx('video')} />
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
