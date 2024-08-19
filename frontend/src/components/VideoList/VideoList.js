import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './VideoList.module.scss';
import VideoItem from './VideoItem/VideoItem';

const cx = classNames.bind(styles);

function VideoList({ data, lastVideoElementRef }) {
    return (
        <div className={cx('wrapper')}>
            {data.map((item, index) => (
                <VideoItem
                    key={item._id}
                    data={item}
                    isLast={index === data.length - 1}
                    lastVideoElementRef={lastVideoElementRef}
                />
            ))}
        </div>
    );
}

VideoList.propTypes = {
    data: PropTypes.array.isRequired,
};

export default VideoList;
