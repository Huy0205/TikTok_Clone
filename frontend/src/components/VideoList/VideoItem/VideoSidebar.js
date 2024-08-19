import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './VideoItem.module.scss';
import { UserServices } from '~/services';
import Avatar from '~/components/Avatar';
import { BookmarkIcon, CommentIcon, HeartIcon, ShareIcon } from '~/components/Icon';

const cx = classNames.bind(styles);

function VideoSibar({ publisherId, shares }) {
    const [publisher, setPublisher] = useState();

    useEffect(() => {
        const fetchPublisher = async () => {
            const res = await UserServices.getUserByTiktokId(publisherId);
            setPublisher(res.data);
        };
        fetchPublisher();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('sibar')}>
            <Link to={`/@${publisherId}`} className={cx('btn')}>
                <Avatar src={publisher?.avatar} alt={publisher?.nickname} size={48} className={cx('avatar')} />
            </Link>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <HeartIcon />
                </span>
                <strong>1433</strong>
            </button>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <CommentIcon />
                </span>
                <strong>1433</strong>
            </button>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <BookmarkIcon />
                </span>
                <strong>1433</strong>
            </button>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <ShareIcon />
                </span>
                <strong>{shares}</strong>
            </button>
        </div>
    );
}

export default VideoSibar;
