import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './VideoList.module.scss';
import VideoItem from './VideoItem/VideoItem';

const cx = classNames.bind(styles);

function VideoList({ data }) {
    return (
        <div className={cx('wrapper')}>
            {data.map((item) => (
                <VideoItem key={item.id} data={item} />
            ))}
        </div>
    );
}

VideoList.propTypes = {
    data: PropTypes.array.isRequired,
};

export default VideoList;
