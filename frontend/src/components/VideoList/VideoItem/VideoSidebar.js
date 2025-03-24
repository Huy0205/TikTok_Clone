import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';

import styles from './VideoItem.module.scss';
import { LikeServices, SaveServices, UserServices } from '~/services';
import Avatar from '~/components/Avatar';
import { BookmarkIcon, CommentIcon, HeartIcon, ShareIcon } from '~/components/Icon';
import { AuthContext, ModalContext, SocketContext } from '~/contexts';

const cx = classNames.bind(styles);

function VideoSibar({ videoId, publisherId, shares }) {
    const location = useLocation();

    const { auth, isLoadingAuth } = useContext(AuthContext);
    const { user, isAuthenticated } = auth;
    const { openModal } = useContext(ModalContext);
    const socket = useContext(SocketContext);

    const [publisher, setPublisher] = useState();
    const [likeCount, setLikeCount] = useState(0);
    const [saveCount, setSaveCount] = useState(0);
    const [likeId, setLikeId] = useState(null);
    const [saveId, setSaveId] = useState(null);

    const isLikingRef = useRef(false);
    const isSavingRef = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            const [userRes, countLikeRes, countSaveRes] = await Promise.all([
                UserServices.getUserByTiktokId(publisherId),
                LikeServices.countLikesByVideoId(videoId),
                SaveServices.countSavesByVideoId(videoId),
            ]);
            setPublisher(userRes.data);
            setLikeCount(countLikeRes.data);
            setSaveCount(countSaveRes.data);
        };
        fetchData();
    }, [publisherId, videoId]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('joinRoom', { roomId: videoId, roomType: 'video' });

        socket.on('likeCountUpdated', ({ videoId: updatedId, change }) => {
            if (updatedId === videoId) {
                setLikeCount((prev) => prev + change);
            }
        });

        socket.on('saveCountUpdated', ({ videoId: updatedId, change }) => {
            if (updatedId === videoId) {
                setSaveCount((prev) => prev + change);
            }
        });

        return () => {
            socket.emit('leaveRoom', { roomId: videoId, roomType: 'video' });
            socket.off('likeCountUpdated');
        };
    }, [socket, videoId]);

    const formatNumber = (num) => {
        if (num < 1000) return num.toString();
        if (num < 1_000_000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    };

    const handleToggleInteraction = async ({
        isProcessingRef,
        interactionType, // "like" hoặc "save"
        itemId,
        setItemId,
        service,
        socketEvent,
    }) => {
        if (!isLoadingAuth && !isAuthenticated) {
            openModal(location);
            return;
        }

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        if (itemId) {
            const deleteRes = await service.deleteOne(itemId);
            if (deleteRes.code === 'OK') {
                setItemId(null);
                socket.emit(socketEvent, { videoId, action: `un${interactionType}` });
            }
        } else {
            const addRes = await service.addOne({
                [`${interactionType}rId`]: user.tiktokId,
                videoId,
            });

            if (addRes.code === 'OK') {
                setItemId(addRes.data._id);
                socket.emit(socketEvent, { videoId, action: interactionType });
            }
        }

        isProcessingRef.current = false;
    };

    const handleLike = () =>
        handleToggleInteraction({
            isProcessingRef: isLikingRef,
            interactionType: 'like',
            itemId: likeId,
            setItemId: setLikeId,
            service: LikeServices,
            socketEvent: 'updateLikeCount',
        });

    const handleSave = () =>
        handleToggleInteraction({
            isProcessingRef: isSavingRef,
            interactionType: 'save',
            itemId: saveId,
            setItemId: setSaveId,
            service: SaveServices,
            socketEvent: 'updateSaveCount',
        });

    return (
        <div className={cx('sibar')}>
            <Link to={`/@${publisherId}`} className={cx('btn')}>
                <Avatar src={publisher?.avatar} alt={publisher?.nickname} size={48} className={cx('avatar')} />
            </Link>
            <button className={cx('btn')} onClick={handleLike}>
                <span className={cx('icon-btn-wrapper', likeId && 'liked')}>
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
            <button className={cx('btn')} onClick={handleSave}>
                <span className={cx('icon-btn-wrapper', saveId && 'saved')}>
                    <BookmarkIcon />
                </span>
                <strong>{formatNumber(saveCount)}</strong>
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
