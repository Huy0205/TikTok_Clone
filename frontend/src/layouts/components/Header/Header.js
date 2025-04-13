import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRightFromBracket,
    faCoins,
    faEllipsisVertical,
    faGear,
    faLanguage,
    faLightbulb,
    faMoon,
    faPlus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion, faKeyboard, faMessage, faPaperPlane, faUser } from '@fortawesome/free-regular-svg-icons';

import styles from './Header.module.scss';
import config from '~/config';
import images from '~/assets/images';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import Avatar from '~/components/Avatar';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { showConfirmDialog } from '~/components/ConfirmDialog';
import { checkFollowStatus } from '~/util/checkFollowStatus';
import Search from '../Search/Search';
import { AuthContext } from '~/contexts/AuthContext';
import { ModalContext, SocketContext } from '~/contexts';
import { FollowServices, NotificationServices, UserServices } from '~/services';

const cx = classNames.bind(styles);

function Header() {
    const location = useLocation();

    const { openModal } = useContext(ModalContext);
    const { auth } = useContext(AuthContext);
    const { isAuthenticated, user } = auth;
    const socket = useContext(SocketContext);

    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [showNotificationList, setShowNotificationList] = useState(false);
    const [isSwalOpen, setIsSwalOpen] = useState(false);

    const headerRef = useRef();
    const notificationsRef = useRef([]);

    const ITEMS_WITHOUT_LOGIN = [
        {
            icon: <FontAwesomeIcon icon={faLightbulb} />,
            title: 'Trung tâm nhà sáng tạo LIVE',
        },
        {
            icon: <FontAwesomeIcon icon={faLanguage} />,
            title: 'Tiếng Việt',
            children: {
                title: 'Ngôn ngữ',
                data: [
                    {
                        title: 'Tiếng Việt',
                        checked: true,
                    },
                    {
                        title: 'Tiếng Anh',
                    },
                    {
                        title: 'Tiếng Hàn',
                    },
                    {
                        title: 'Tiếng Nhật',
                    },
                ],
            },
        },
        {
            icon: <FontAwesomeIcon icon={faCircleQuestion} />,
            title: 'Phản hồi và trợ giúp',
        },
        {
            icon: <FontAwesomeIcon icon={faKeyboard} />,
            title: 'Phím tắt trên bàn phím',
        },
        {
            icon: <FontAwesomeIcon icon={faMoon} />,
            title: 'Chế độ tối',
            hasSwitchButton: true,
        },
    ];

    const [head, ...tail] = ITEMS_WITHOUT_LOGIN;

    const ITEMS_WITH_LOGIN = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Xem hồ sơ',
            to: `/@${user.tiktokId}`,
        },
        {
            icon: <FontAwesomeIcon icon={faCoins} />,
            title: 'Nhận xu',
        },
        head,
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Cài đặt',
        },
        ...tail,
        {
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            title: 'Đăng xuất',
            hasTopLine: true,
            onClick() {
                localStorage.clear();
                window.location.href = '/';
            },
        },
    ];

    const formatDate = (stringDate) => {
        const convertDate = new Date(stringDate);
        const year = convertDate.getFullYear();
        const month = convertDate.getMonth() + 1;
        const day = convertDate.getDate();
        return `${year} - ${month} - ${day}`;
    };

    const handleClickLogin = () => {
        openModal(location.pathname);
    };

    const handleClickOutside = () => {
        if (!isSwalOpen) {
            setShowNotificationList(false);
        }
    };

    const handleViewNotification = async (notificationId, isShowNotificationList) => {
        const notificationUpdate = notifications.find((notification) => notification._id === notificationId);
        if (!notificationUpdate.viewed) {
            const updateRes = await NotificationServices.updateViewedById(notificationId, true);
            if (updateRes.code === 'OK') {
                notificationUpdate.viewed = true;
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification._id === notificationId ? notificationUpdate : notification,
                    ),
                );
                setUnreadNotificationCount((prev) => (prev > 0 ? prev - 1 : prev));
                setShowNotificationList(isShowNotificationList);
            }
        }
    };

    const fetchSender = useCallback(
        async (notification) => {
            const { senderId, ...notificationPayload } = notification;
            const [getUserRes, status] = await Promise.all([
                UserServices.getUserByTiktokId(senderId),
                checkFollowStatus(user.tiktokId, senderId),
            ]);
            notificationPayload.followStatus = status;
            if (getUserRes.code === 'OK') {
                notificationPayload.sender = getUserRes.data;
            }
            return notificationPayload;
        },
        [user.tiktokId],
    );

    const handleAddFollow = async (notificationId, senderId) => {
        socket.emit('joinRoom', { roomId: senderId, roomType: 'profile' });

        const response = await FollowServices.addFollow(senderId);
        if (response.code === 'OK') {
            socket.emit('addFollow', {
                followingId: senderId,
                followerId: user.tiktokId,
            });

            socket.emit('updateFollowCountOfProfile', {
                followerId: user.tiktokId,
                followingId: senderId,
                action: 'follow',
            });
        }

        socket.emit('leaveRoom', { roomId: senderId, roomType: 'profile' });
        handleViewNotification(notificationId, true);
    };

    const handleUnFollow = async (notificationId, senderId, followStatus) => {
        if (followStatus === 3) {
            setIsSwalOpen(true);
            const confirmed = await showConfirmDialog({
                title: 'Bạn chắc chắn muốn bỏ follow?',
                text: 'Bạn và người này đang là bạn bè.',
                confirmText: 'Bỏ follow',
                cancelText: 'Hủy',
            });
            setIsSwalOpen(false);
            if (!confirmed) {
                handleViewNotification(notificationId);
                return;
            }
        }
        socket.emit('joinRoom', { roomId: senderId, roomType: 'profile' });

        const response = await FollowServices.removeFollow(senderId);
        if (response.code === 'OK') {
            socket.emit('updateFollowCountOfProfile', {
                followerId: user.tiktokId,
                followingId: senderId,
                action: 'unfollow',
            });
            socket.emit('deletedFollow', { followerId: user.tiktokId, followingId: senderId, type: 'follow' });
        }
        socket.emit('leaveRoom', { roomId: senderId, roomType: 'profile' });
        handleViewNotification(notificationId, true);
    };

    useEffect(() => {
        notificationsRef.current = notifications;
    }, [notifications]);

    useEffect(() => {
        const fetchNotification = async () => {
            const notificationRes = await NotificationServices.getNotificationByReceiverId(user.tiktokId);
            const { code, data } = notificationRes;

            if (code === 'OK') {
                let count = 0;

                const enrichedNotifications = await Promise.all(
                    data.map(async (notification) => {
                        if (!notification.viewed) {
                            count += 1;
                        }
                        return fetchSender(notification);
                    }),
                );
                setNotifications(enrichedNotifications);
                setUnreadNotificationCount(count);
            }
        };

        fetchNotification();
    }, [fetchSender, user.tiktokId]);

    useEffect(() => {
        if (!socket) return;

        const handleFollowNotification = (notification) => {
            (async () => {
                const enriched = await fetchSender(notification);

                setNotifications((prev) => {
                    const exist = prev.find((p) => p._id === enriched._id);
                    const updated = [enriched, ...prev.filter((p) => p._id !== enriched._id)];

                    if (!exist) {
                        setUnreadNotificationCount((prevCount) => prevCount + 1);
                    } else {
                        if (exist.viewed) {
                            setUnreadNotificationCount((prevCount) => prevCount + 1);
                        }
                    }
                    return updated;
                });
            })();
        };
        const handleUpdateFollowStatusForReceiver = async ({ followerId, followingId, type }) => {
            const updated = notificationsRef.current;
            await Promise.all(
                updated.map(async (notification) => {
                    const { sender, receiverId, type: notificationType } = notification;
                    if (sender.tiktokId === followerId && receiverId === followingId && type === notificationType) {
                        notification.followStatus = await checkFollowStatus(receiverId, sender.tiktokId);
                    }
                }),
            );
            setNotifications([...updated]);
        };
        const handleUpdateFollowStatusForSender = async ({ followerId, followingId, type }) => {
            await handleUpdateFollowStatusForReceiver({ followerId: followingId, followingId: followerId, type });
        };

        socket.on('followNotification', handleFollowNotification);
        socket.on('checkFollowStatus', handleUpdateFollowStatusForReceiver);

        const statusEvents = ['followSuccess', 'unfollowSuccess'];
        statusEvents.forEach((event) => {
            socket.on(event, handleUpdateFollowStatusForSender);
        });

        return () => {
            socket.off('followNotification', handleFollowNotification);
            socket.off('checkFollowStatus', handleUpdateFollowStatusForReceiver);
            statusEvents.forEach((event) => {
                socket.off(event, handleUpdateFollowStatusForSender);
            });
        };
    }, [fetchSender, socket]);

    return (
        <header ref={headerRef} className={cx('wrapper')}>
            <div className={cx('logo-wrapper')}>
                <Link className={cx('logo-link')} to={config.routes.home}>
                    <img src={images.logo} alt="logo" />
                </Link>
            </div>

            <Search />

            <div className={cx('action')}>
                {isAuthenticated ? (
                    <>
                        <Button
                            className={cx('upload-button-custom')}
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            leftIconActive={<FontAwesomeIcon icon={faPlus} style={{ color: 'var(--primary)' }} />}
                            size="medium"
                            canActive
                            to={config.routes.upload}
                        >
                            Tải lên
                        </Button>

                        <Tippy content="Tin nhắn" placement="bottom">
                            <Button buttonIcon>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </Tippy>

                        <Tippy content="Hộp thư" placement="bottom" disabled={showNotificationList}>
                            <div>
                                <HeadlessTippy
                                    interactive
                                    visible={showNotificationList}
                                    render={(attrs) => (
                                        <div className={cx('notification-list-wrapper')} tabIndex="-1" {...attrs}>
                                            <PopperWrapper>
                                                <div className={cx('notification-title-container')}>
                                                    <h3>Thông báo</h3>
                                                    <Button
                                                        buttonIcon
                                                        rounded
                                                        onClick={() => {
                                                            console.log('vô X');
                                                            setShowNotificationList(false);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </Button>
                                                </div>
                                                <div>
                                                    {notifications.length > 0 ? (
                                                        notifications.map((notification) => (
                                                            <Button
                                                                key={notification._id}
                                                                noneStyleButton
                                                                size="large"
                                                                className={cx('notification-item')}
                                                                to={`/@${notification.sender.tiktokId}`}
                                                                onClick={() =>
                                                                    handleViewNotification(notification._id, false)
                                                                }
                                                            >
                                                                <Avatar
                                                                    src={notification.sender.avatar}
                                                                    alt="avatar"
                                                                    size={45}
                                                                />
                                                                <div className={cx('notification-content')}>
                                                                    <p className={cx('notification-nickname')}>
                                                                        {notification.sender.nickname}
                                                                    </p>
                                                                    <p
                                                                        className={cx(
                                                                            'notification-message',
                                                                            notification.viewed && 'viewed',
                                                                        )}
                                                                    >
                                                                        <span>{notification.message + '. '}</span>
                                                                        {formatDate(notification.updatedAt)}
                                                                    </p>
                                                                </div>
                                                                <div className={cx('follow-container')}>
                                                                    {notification.followStatus === 1 ||
                                                                    notification.followStatus === 3 ? (
                                                                        <Button
                                                                            bgSecondary
                                                                            className={cx('follow-btn')}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleUnFollow(
                                                                                    notification._id,
                                                                                    notification.sender.tiktokId,
                                                                                    notification.followStatus,
                                                                                );
                                                                            }}
                                                                        >
                                                                            {notification.followStatus === 1
                                                                                ? 'Đang follow'
                                                                                : 'Bạn bè'}
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            bgPrimary
                                                                            className={cx('follow-btn')}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleAddFollow(
                                                                                    notification._id,
                                                                                    notification.sender.tiktokId,
                                                                                );
                                                                            }}
                                                                        >
                                                                            {notification.followStatus === 2
                                                                                ? 'Follow lại'
                                                                                : 'Follow'}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </Button>
                                                        ))
                                                    ) : (
                                                        <div className={cx('none-notification')}>
                                                            Chưa có thông báo nào
                                                        </div>
                                                    )}
                                                </div>
                                            </PopperWrapper>
                                        </div>
                                    )}
                                    onClickOutside={handleClickOutside}
                                >
                                    <Button
                                        buttonIcon
                                        className={cx('relative')}
                                        onClick={(e) => {
                                            console.log('vô btn');
                                            setShowNotificationList(!showNotificationList);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faMessage} />
                                        {unreadNotificationCount > 0 && (
                                            <div className={cx('notification-container')}>
                                                <span className={cx('notification-badge')}>
                                                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                                                </span>
                                            </div>
                                        )}
                                    </Button>
                                </HeadlessTippy>
                            </div>
                        </Tippy>
                    </>
                ) : (
                    <Button borderPrimary bgPrimary onClick={handleClickLogin}>
                        Đăng nhập
                    </Button>
                )}

                <Menu items={isAuthenticated ? ITEMS_WITH_LOGIN : ITEMS_WITHOUT_LOGIN}>
                    {isAuthenticated ? (
                        <Avatar src={user.avatar} alt="avatar" size={36} />
                    ) : (
                        <FontAwesomeIcon className={cx('more-icon')} icon={faEllipsisVertical} />
                    )}
                </Menu>
            </div>
        </header>
    );
}

export default Header;
