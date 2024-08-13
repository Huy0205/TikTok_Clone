import { useContext } from 'react';
import classNames from 'classnames/bind';

import Menu from './Menu/Menu';
import Button from '~/components/Button';
import styles from './Sidebar.module.scss';
import { AuthContext } from '~/contexts/AuthContext';
import images from '~/assets/images';
import { ModalContext } from '~/contexts';

const cx = classNames.bind(styles);

function Sidebar() {
    const { openModal } = useContext(ModalContext);
    const { auth } = useContext(AuthContext);
    const { isAuthenticated } = auth;

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
