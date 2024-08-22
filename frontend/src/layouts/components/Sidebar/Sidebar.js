import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';
import { UserServices } from '~/services';
import { AuthContext } from '~/contexts/AuthContext';
import { ModalContext } from '~/contexts';
import Menu from './Menu/Menu';
import Button from '~/components/Button';
import images from '~/assets/images';
import AccountItem from '~/components/AccountItem';

const cx = classNames.bind(styles);

function Sidebar() {
    const { openModal } = useContext(ModalContext);
    const { auth } = useContext(AuthContext);
    const { isAuthenticated } = auth;

    const [followings, setFollowings] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchFollowings = async () => {
            const res = await UserServices.getUserByFollowings(page, 10);
            if (res) {
                setFollowings((prev) => [...prev, ...res.data]);
                setHasMore(res.data.length % 10 === 0);
            }
        };

        fetchFollowings();
    }, [isAuthenticated, page]);

    const handleIncreasePage = async () => {
        setPage(page + 1);
    };

    return (
        <aside className={cx('wrapper')}>
            <Menu />
            {isAuthenticated ? (
                <></>
            ) : (
                <div className={cx('login-wrapper')}>
                    <p className={cx('login-tip')}>Đăng nhập để follow các tác giả, thích video và xem bình luận.</p>
                    <Button size="large" borderPrimary onClick={openModal}>
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
