import { useContext } from 'react';
import classNames from 'classnames/bind';

import styles from './Menu.module.scss';
import Button from '~/components/Button';
import {
    CompassIcon,
    CompassIconActive,
    FollowingIcon,
    FollowingIconActive,
    FriendIcon,
    FriendIconActive,
    HomeIcon,
    HomeIconActive,
    LiveIcon,
    LiveIconActive,
    ProfileIcon,
} from '~/components/Icon';
import { ModalContext } from '~/contexts';
import { AuthContext } from '~/contexts/AuthContext';
import config from '~/config';
import Image from '~/components/Avatar';

const cx = classNames.bind(styles);

function Menu() {
    const { openModal } = useContext(ModalContext);
    const { auth } = useContext(AuthContext);
    const { isAuthenticated, user } = auth;

    const Avatar = () => <Image src={user?.avatar} size={24} alt="avatar" className={cx('profile-image')} />;

    return (
        <nav className={cx('menu-wrapper')}>
            <Button
                leftIcon={<HomeIcon />}
                leftIconActive={<HomeIconActive />}
                size="large"
                noneStyleButton
                canActive
                className={cx('menu-item')}
                to={config.routes.home}
            >
                <span className={cx('menu-item-text')}>Dành cho bạn</span>
            </Button>
            <Button
                leftIcon={<CompassIcon />}
                leftIconActive={<CompassIconActive />}
                size="large"
                noneStyleButton
                canActive
                className={cx('menu-item')}
                to={config.routes.explore}
            >
                <span className={cx('menu-item-text')}>Khám phá</span>
            </Button>
            <Button
                leftIcon={<FollowingIcon />}
                leftIconActive={<FollowingIconActive />}
                size="large"
                noneStyleButton
                canActive
                className={cx('menu-item')}
                to={config.routes.following}
            >
                <span className={cx('menu-item-text')}>Đang Follow</span>
            </Button>
            {isAuthenticated && (
                <Button
                    leftIcon={<FriendIcon />}
                    leftIconActive={<FriendIconActive />}
                    size="large"
                    noneStyleButton
                    canActive
                    className={cx('menu-item')}
                    to={config.routes.friends}
                >
                    <span className={cx('menu-item-text')}>Bạn bè</span>
                </Button>
            )}
            <Button
                leftIcon={<LiveIcon />}
                leftIconActive={<LiveIconActive />}
                size="large"
                noneStyleButton
                canActive
                className={cx('menu-item')}
                to={config.routes.live}
            >
                <span className={cx('menu-item-text')}>LIVE</span>
            </Button>
            <Button
                leftIcon={isAuthenticated ? <Avatar /> : <ProfileIcon />}
                leftIconActive={<Avatar />}
                size="large"
                noneStyleButton
                canActive={isAuthenticated}
                className={cx('menu-item')}
                {...(isAuthenticated ? { to: `/@${user.tiktokId}` } : { onClick: openModal })}
            >
                <span className={cx('menu-item-text')}>Hồ sơ</span>
            </Button>
        </nav>
    );
}

export default Menu;
