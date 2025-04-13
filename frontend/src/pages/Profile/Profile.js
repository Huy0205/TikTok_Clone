import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Profile.module.scss';
import { FollowServices, LikeServices, UserServices, VideoServices } from '~/services';
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import { FollowCheckIcon, SettingRegularIcon, ShareRegularIcon } from '~/components/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import VideoList from './VideoList';
import Loading from '~/components/Loading';
import { AuthContext, ModalContext, SocketContext } from '~/contexts';
import { checkFollowStatus } from '~/util/checkFollowStatus';
import { showConfirmDialog } from '~/components/ConfirmDialog';

const cx = classNames.bind(styles);

function Profile() {
    const { tiktokId } = useParams();

    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);
    const { user: userAuth, isAuthenticated, isLoadingAuth } = auth;
    const { openModal } = useContext(ModalContext);
    const socket = useContext(SocketContext);

    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('video');
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const [sortOption, setSortOption] = useState('new');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followStatus, setFollowStatus] = useState(0);
    const [numberOfFollower, setNumberOfFollower] = useState(0);
    const [numberOfFollowing, setNumberOfFollowing] = useState(0);
    const [numberOfLike, setNumberOfLike] = useState(0);
    const [followStatusTrigger, setFollowStatusTrigger] = useState(0);

    const tabRefs = {
        video: useRef(null),
        liked: useRef(null),
        saved: useRef(null),
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [tiktokId]);

    useEffect(() => {
        const currentTab = tabRefs[activeTab].current;
        setIndicatorStyle({
            width: currentTab.offsetWidth,
            transform: `translateX(${currentTab.offsetLeft}px)`,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await UserServices.getUserByTiktokId(tiktokId.slice(1));
            if (response.code === 'OK') setUser(response.data);
            else navigate(-1);
        };
        fetchUser();
    }, [navigate, tiktokId]);

    useEffect(() => {
        setLoading(true);
        if (!user.tiktokId) return;

        const fetchVideos = async () => {
            const apiMap = {
                video: VideoServices.getVideoByPublisherId,
                liked: VideoServices.getVideoUserLiked,
                saved: VideoServices.getVideoUserSaved,
            };

            const fetchFunction = apiMap[activeTab];
            if (!fetchFunction) return;

            const response = await fetchFunction(user.tiktokId, 1, 8, sortOption === 'new' ? -1 : 1);
            if (response.code === 'OK') setVideos(response.data);

            setLoading(false);
        };

        fetchVideos();
    }, [activeTab, sortOption, user.tiktokId]);

    useEffect(() => {
        if (!user.tiktokId || !userAuth.tiktokId) return;
        if (user.tiktokId === userAuth.tiktokId) return;

        const fetchFollowStatus = async () => {
            const status = await checkFollowStatus(userAuth.tiktokId, user.tiktokId);
            setFollowStatus(status);
        };
        fetchFollowStatus();
    }, [user.tiktokId, userAuth.tiktokId, followStatusTrigger]);

    useEffect(() => {
        if (!socket || !tiktokId) return;

        const roomId = tiktokId.startsWith('@') ? tiktokId.slice(1) : tiktokId;

        socket.emit('joinRoom', { roomId, roomType: 'profile' });

        const handleFollowCountUpdate = ({ followerId, change }) => {
            if (roomId === followerId) {
                setNumberOfFollowing((prev) => prev + change);
            } else {
                setNumberOfFollower((prev) => prev + change);
            }
        };
        const handleLikeCountUpdate = (change) => {
            setNumberOfLike((prev) => prev + change);
        };
        const updateFollowStatus = () => {
            setFollowStatusTrigger((prev) => prev + 1);
        };

        socket.on('followCountOfProfileUpdated', handleFollowCountUpdate);
        socket.on('likeCountUpdated', handleLikeCountUpdate);

        const statusEvents = ['followNotification', 'checkFollowStatus', 'followSuccess', 'unfollowSuccess'];
        statusEvents.forEach((event) => {
            socket.on(event, updateFollowStatus);
        });

        return () => {
            socket.emit('leaveRoom', { roomId, roomType: 'profile' });
            socket.off('followCountOfProfileUpdated', handleFollowCountUpdate);
            socket.off('likeCountUpdated', handleLikeCountUpdate);
            statusEvents.forEach((event) => {
                socket.on(event, updateFollowStatus);
            });
        };
    }, [socket, tiktokId]);

    useEffect(() => {
        if (!user.tiktokId) return;
        const countFollowOfUser = async () => {
            const [countByFollowingRes, countByFollowerRes, countLikeRes] = await Promise.all([
                FollowServices.countByFollowing(user.tiktokId),
                FollowServices.countByFollower(user.tiktokId),
                LikeServices.countLikesByPublisherId(user.tiktokId),
            ]);
            if (countByFollowingRes.code === 'OK') {
                setNumberOfFollower(countByFollowingRes.data);
            }
            if (countByFollowerRes.code === 'OK') {
                setNumberOfFollowing(countByFollowerRes.data);
            }
            if (countLikeRes.code === 'OK') {
                setNumberOfLike(countLikeRes.data);
            }
        };
        countFollowOfUser();
    }, [user.tiktokId]);

    const handleSort = (sortBy) => {
        setSortOption(sortBy);
    };

    const handleAddFollow = async () => {
        if (!isLoadingAuth) {
            if (isAuthenticated) {
                const response = await FollowServices.addFollow(user.tiktokId);
                if (response.code === 'OK') {
                    socket.emit('addFollow', {
                        followingId: user.tiktokId,
                        followerId: userAuth.tiktokId,
                    });
                    socket.emit('updateFollowCountOfProfile', {
                        followerId: userAuth.tiktokId,
                        followingId: user.tiktokId,
                        action: 'follow',
                    });
                }
            } else {
                openModal();
            }
        }
    };

    const handleUnFollow = async () => {
        if (followStatus === 3) {
            const confirmed = await showConfirmDialog({
                title: 'Bạn chắc chắn muốn bỏ follow?',
                text: 'Bạn và người này đang là bạn bè.',
                confirmText: 'Bỏ follow',
                cancelText: 'Hủy',
            });
            if (!confirmed) return;
        }
        const response = await FollowServices.removeFollow(user.tiktokId);
        if (response.code === 'OK') {
            socket.emit('updateFollowCountOfProfile', {
                followerId: userAuth.tiktokId,
                followingId: user.tiktokId,
                action: 'unfollow',
            });
            socket.emit('deletedFollow', { followerId: userAuth.tiktokId, followingId: user.tiktokId, type: 'follow' });
        }
    };

    if (!user)
        return (
            <div className={cx('loading')}>
                <Loading />
            </div>
        );

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('info')}>
                    <div className={cx('avatar-container')}>
                        <Avatar src={user.avatar} size={212} />
                    </div>
                    <div className={cx('info-content')}>
                        <div className={cx('name-container')}>
                            <h1 className={cx('tiktokId')}>{user.tiktokId}</h1>
                            <h2 className={cx('nickname')}>{user.nickname}</h2>
                        </div>
                        <div className={cx('action')}>
                            {userAuth?.tiktokId === user.tiktokId ? (
                                <>
                                    <Button bgPrimary className={cx('btn-item', 'custom')}>
                                        Sửa hồ sơ
                                    </Button>
                                    <Button bgSecondary className={cx('btn-item')}>
                                        <SettingRegularIcon />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {followStatus === 1 || followStatus === 3 ? (
                                        <Button
                                            bgSecondary
                                            className={cx('btn-item', 'custom')}
                                            onClick={handleUnFollow}
                                        >
                                            <FollowCheckIcon />
                                            {followStatus === 1 ? 'Đang follow' : 'Bạn bè'}
                                        </Button>
                                    ) : (
                                        <Button
                                            bgPrimary
                                            className={cx('btn-item', 'custom')}
                                            onClick={handleAddFollow}
                                        >
                                            {followStatus === 2 ? 'Follow lại' : 'Follow'}
                                        </Button>
                                    )}
                                    <Button bgSecondary className={cx('btn-item', 'custom')}>
                                        Tin nhắn
                                    </Button>
                                </>
                            )}
                            <Button bgSecondary className={cx('btn-item')}>
                                <ShareRegularIcon />
                            </Button>
                            {userAuth?.tiktokId !== user.tiktokId && (
                                <Button bgSecondary className={cx('btn-item')}>
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </Button>
                            )}
                        </div>
                        <h3 className={cx('number-container')}>
                            <div className={cx('number-item')}>
                                <strong className={cx('number')}>{numberOfFollowing}</strong>
                                <span className={cx('number-text')}>Đang follow</span>
                            </div>
                            <div className={cx('number-item')}>
                                <strong className={cx('number')}>{numberOfFollower}</strong>
                                <span className={cx('number-text')}>Follower</span>
                            </div>
                            <div className={cx('number-item')}>
                                <strong className={cx('number')}>{numberOfLike}</strong>
                                <span className={cx('number-text')}>Thích</span>
                            </div>
                        </h3>
                    </div>
                </div>
                <div className={cx('list-video-wrapper')}>
                    <div className={cx('options-container')}>
                        <div className={cx('tab')}>
                            <p
                                ref={tabRefs.video}
                                aria-selected={activeTab === 'video'}
                                onClick={() => setActiveTab('video')}
                            >
                                Video
                            </p>
                            <p
                                ref={tabRefs.liked}
                                aria-selected={activeTab === 'liked'}
                                onClick={() => setActiveTab('liked')}
                            >
                                Đã thích
                            </p>
                            <p
                                ref={tabRefs.saved}
                                aria-selected={activeTab === 'saved'}
                                onClick={() => setActiveTab('saved')}
                            >
                                Đã lưu
                            </p>
                            <div className={cx('underline')} style={indicatorStyle}></div>
                        </div>
                        <div>
                            <div className={cx('sort')}>
                                <Button
                                    bgWhite={sortOption === 'new'}
                                    size="small"
                                    className={cx('sort-option', {
                                        active: sortOption === 'new',
                                    })}
                                    onClick={() => handleSort('new')}
                                >
                                    Mới nhất
                                </Button>
                                <Button
                                    bgWhite={sortOption === 'old'}
                                    size="small"
                                    className={cx('sort-option', {
                                        active: sortOption === 'old',
                                    })}
                                    onClick={() => handleSort('old')}
                                >
                                    Cũ nhất
                                </Button>
                            </div>
                        </div>
                    </div>
                    <VideoList data={videos} />
                    {loading && videos.length > 0 && (
                        <div className={cx('loading')}>
                            <Loading />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
