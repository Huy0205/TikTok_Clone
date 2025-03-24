import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './VideoList.module.scss';
import VideoItem from './VideoItem/VideoItem';
import { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { VideoListContext } from '~/contexts';

const cx = classNames.bind(styles);

function VideoList({ data }) {
    const { hasMore, setPage, scrollPosition, setScrollPosition } = useContext(VideoListContext);

    const observer = useRef();

    const lastVideoElementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [hasMore, setPage],
    );

    useEffect(() => {
        return () => {
            setScrollPosition(window.scrollY);
        };
    }, [setScrollPosition]);

    useEffect(() => {
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition, 10));
        }
    }, [scrollPosition]);

    return (
        <div className={cx('wrapper')}>
            {data.length > 0 &&
                data.map((item, index) => (
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

export default memo(VideoList);
