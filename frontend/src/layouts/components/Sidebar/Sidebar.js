import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';
import { UserServices } from '~/services';
import { AuthContext } from '~/contexts/AuthContext';
import { ModalContext, SocketContext } from '~/contexts';
import Menu from './Menu/Menu';
import Button from '~/components/Button';
import images from '~/assets/images';
import AccountItem from '~/components/AccountItem';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function Sidebar() {
    const location = useLocation();

    const { openModal } = useContext(ModalContext);
    const { auth } = useContext(AuthContext);
    const { isAuthenticated } = auth;
    const socket = useContext(SocketContext);

    const [followings, setFollowings] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const followingsRef = useRef([]);
    const hasMoreRef = useRef(true);
    const pageRef = useRef(page);

    const handleIncreasePage = () => {
        setPage(page + 1);
    };

    const handleClickLogin = () => {
        openModal(location.pathname);
    };

    const fetchUsers = useCallback(async () => {
        const res = await UserServices.getUserByFollowings(page, 10);
        if (res.code === 'OK') {
            return res.data;
        }
        return null;
    }, [page]);

    const handleAddFollowing = useCallback(async ({ followingId }) => {
        const userRes = await UserServices.getUserByTiktokId(followingId);
        if (userRes.code === 'OK') {
            const followingsLength = followingsRef.current.length;
            if (followingsLength > 0 && followingsLength % 10 === 0) {
                setFollowings((prev) => [userRes.data, ...prev.slice(0, -1)]);
                setHasMore(true);
            } else {
                setFollowings((prev) => [userRes.data, ...prev]);
            }
        }
    }, []);

    const handleDeleteFollowing = useCallback(
        async ({ followingId }) => {
            const currentFollowings = followingsRef.current;
            const updateFollowings = currentFollowings.filter((following) => following.tiktokId !== followingId);
            if (updateFollowings.length < currentFollowings.length) {
                let updated = [];
                if (hasMoreRef.current) {
                    const { users, total } = await fetchUsers();
                    updated = [...updateFollowings, users[users.length - 1]];
                    setHasMore(updated.length < total);
                } else {
                    updated = [...updateFollowings];
                }
                setFollowings(updated);
            }
        },
        [fetchUsers],
    );

    useEffect(() => {
        followingsRef.current = followings;
        hasMoreRef.current = hasMore;
        pageRef.current = page;
    }, [followings, hasMore, page]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchFollowings = async () => {
            const { users, total } = await fetchUsers();
            const updated = [...followingsRef.current, ...users];
            setFollowings(updated);
            setHasMore(updated.length < total);
        };
        fetchFollowings();
    }, [fetchUsers, isAuthenticated]);

    useEffect(() => {
        if (!socket) return;

        socket.on('followSuccess', handleAddFollowing);
        socket.on('unfollowSuccess', handleDeleteFollowing);

        return () => {
            socket.off('followSuccess', handleAddFollowing);
            socket.off('unfollowSuccess', handleDeleteFollowing);
        };
    }, [handleAddFollowing, handleDeleteFollowing, socket]);

    return (
        <aside className={cx('wrapper')}>
            <Menu />
            {isAuthenticated ? (
                <></>
            ) : (
                <div className={cx('login-wrapper')}>
                    <p className={cx('login-tip')}>Đăng nhập để follow các tác giả, thích video và xem bình luận.</p>
                    <Button size="large" borderPrimary onClick={handleClickLogin}>
                        <span className={cx('text-login-btn')}>Đăng nhập</span>
                    </Button>
                </div>
            )}
            {followings.length > 0 && (
                <div className={cx('followings-container')}>
                    <h4 className={cx('followings-title')}>Các tài khoản Đã follow</h4>
                    {followings.map((following) => (
                        <Button
                            key={following._id}
                            size="large"
                            noneStyleButton
                            className={cx('account-item-container')}
                            to={`/@${following.tiktokId}`}
                        >
                            <AccountItem account={following} className={cx('account-item')} />
                        </Button>
                    ))}
                    {hasMore && (
                        <button className={cx('more-btn')} onClick={handleIncreasePage}>
                            Xem thêm
                        </button>
                    )}
                </div>
            )}
            <div className={cx('footer')}>
                <a
                    className={cx('create-animation-btn')}
                    target="_blank"
                    rel="noreferrer"
                    href="https://effecthouse.tiktok.com/download?utm_campaign=ttweb_entrance_v1&utm_source=tiktok_webapp_main"
                >
                    <img
                        className={cx('create-animation-btn-bg')}
                        src={images.createAnimation}
                        alt="Create Animation button"
                    />
                    <h4 className={cx('create-animation-btn-text')}>Tạo hiệu ứng TikTok, nhận phần thưởng</h4>
                </a>
                <a
                    className={cx('create-animation-btn-responsive-wrapper')}
                    href="https://effecthouse.tiktok.com/download?utm_campaign=ttweb_entrance_v1&utm_source=tiktok_webapp_main"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className={cx('create-animation-btn-responsive')}></div>
                </a>
                <h4 className={cx('text-info')}>Công ty</h4>
                <h4 className={cx('text-info')}>Chương trình</h4>
                <h4 className={cx('text-info')}>Điều khoản và chính sách</h4>
                <span className={cx('text-more')}>Thêm</span>
                <p className={cx('copy-right')}>© 2024 TikTok</p>
            </div>
        </aside>
    );
}

export default Sidebar;
