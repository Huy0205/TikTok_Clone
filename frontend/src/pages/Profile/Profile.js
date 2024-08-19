import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Profile.module.scss';
import { FollowServices, UserServices, VideoServices } from '~/services';
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import { FollowCheckIcon, SettingRegularIcon, ShareRegularIcon } from '~/components/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import VideoList from './VideoList';
import Loading from '~/components/Loading';
import { AuthContext } from '~/contexts';

const cx = classNames.bind(styles);

function Profile() {
    const { tiktokId } = useParams();

    const { auth } = useContext(AuthContext);
    const { user: userAuth } = auth;

    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('video');
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const [sortOption, setSortOption] = useState('new');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [numberOfFollower, setNumberOfFollower] = useState(0);

    const tabRefs = {
        video: useRef(null),
        liked: useRef(null),
    };

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
            const cleanedTiktokId = tiktokId.startsWith('@') ? tiktokId.slice(1) : tiktokId;
            const response = await UserServices.getUserByTiktokId(cleanedTiktokId);
            if (response.code === 'OK') setUser(response.data);
        };
        fetchUser();
    }, [tiktokId]);

    useEffect(() => {
        setLoading(true);
        const fetchVideos = async () => {
            if (activeTab === 'video') {
                const response = await VideoServices.getVideoByPublisherId(
                    user.tiktokId,
                    1,
                    8,
                    sortOption === 'new' ? -1 : 1,
                );
                if (response.code === 'OK') setVideos(response.data);
            } else {
                const response = await VideoServices.getVideoUserLiked(
                    user.tiktokId,
                    1,
                    10,
                    sortOption === 'new' ? -1 : 1,
                );
                if (response.code === 'OK') setVideos(response.data);
            }
            setLoading(false);
        };
        fetchVideos();
    }, [activeTab, sortOption, user.tiktokId]);

    useEffect(() => {
        const checkFollow = async () => {
            if (userAuth) {
                const response = await FollowServices.checkFollow(user.tiktokId);
                if (response.code === 'OK') setFollowed(!!response.data);
            }
        };
        checkFollow();
    }, [user.tiktokId, userAuth]);

    useEffect(() => {
        const countFollowOfUser = async () => {
            const response = await FollowServices.countFollowOfUser(user.tiktokId);
            if (response.code === 'OK') {
                setNumberOfFollower(response.data);
            }
        };
        countFollowOfUser();
    }, [user.tiktokId, followed]);

    const handleSort = (sortBy) => {
        setSortOption(sortBy);
    };

    const handleAddFollow = async () => {
        if (userAuth) {
            const response = await FollowServices.addFollow(user.tiktokId);
            if (response.code === 'OK') setFollowed(true);
        }
    };

    const handleUnFollow = async () => {
        if (userAuth) {
            const response = await FollowServices.removeFollow(user.tiktokId);
            if (response.code === 'OK') setFollowed(false);
        }
    };

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
                                    {followed ? (
                                        <Button
                                            bgSecondary
                                            className={cx('btn-item', 'custom')}
                                            onClick={handleUnFollow}
                                        >
                                            <FollowCheckIcon />
                                            Đang follow
                                        </Button>
                                    ) : (
                                        <Button
                                            bgPrimary
                                            className={cx('btn-item', 'custom')}
                                            onClick={handleAddFollow}
                                        >
                                            Follow
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
                                <strong className={cx('number')}>165</strong>
                                <span className={cx('number-text')}>Đang follow</span>
                            </div>
                            <div className={cx('number-item')}>
                                <strong className={cx('number')}>{numberOfFollower}</strong>
                                <span className={cx('number-text')}>Follower</span>
                            </div>
                            <div className={cx('number-item')}>
                                <strong className={cx('number')}>165</strong>
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
