import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

import styles from './VideoItem.module.scss';
import { LikeServices, UserServices } from '~/services';
import Avatar from '~/components/Avatar';
import { BookmarkIcon, CommentIcon, HeartIcon, ShareIcon } from '~/components/Icon';
import { AuthContext, ModalContext } from '~/contexts';

const cx = classNames.bind(styles);

function VideoSibar({ videoId, publisherId, shares }) {
    const location = useLocation();

    const { auth, isLoadingAuth } = useContext(AuthContext);
    const { user, isAuthenticated } = auth;
    const { openModal } = useContext(ModalContext);

    const [publisher, setPublisher] = useState();
    const [likeCount, setLikeCount] = useState(0);
    const [likeId, setLikeId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [userRes, countLikeRes] = await Promise.all([
                UserServices.getUserByTiktokId(publisherId),
                LikeServices.countLikesByVideoId(videoId),
            ]);
            setPublisher(userRes.data);
            setLikeCount(countLikeRes.data);
        };
        fetchData();
    }, [publisherId, videoId]);

    const formatNumber = (num) => {
        if (num < 1000) return num.toString();
        if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    };

    const handleLike = async () => {
        if (!isLoadingAuth && !isAuthenticated) {
            openModal(location);
            return;
        }
        if (likeId) {
            const deleteRes = await LikeServices.deleteLike(likeId);
            if (deleteRes.code === 'OK') {
                setLikeId(null);
            }
        } else {
            const saveRes = await LikeServices.saveLike({
                likerId: user.tiktokId,
                videoId,
            });
            if (saveRes.code === 'OK') {
                setLikeId(saveRes.data._id);
            }
        }
    };

    return (
        <div className={cx('sibar')}>
            <Link to={`/@${publisherId}`} className={cx('btn')}>
                <Avatar src={publisher?.avatar} alt={publisher?.nickname} size={48} className={cx('avatar')} />
            </Link>
            <button className={cx('btn')} onClick={handleLike}>
                <span className={cx('icon-btn-wrapper', likeId ? 'liked' : '')}>
                    <HeartIcon />
                </span>
                <strong>{formatNumber(likeCount)}</strong>
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
