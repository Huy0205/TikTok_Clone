import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
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
} from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion, faKeyboard, faMessage, faPaperPlane, faUser } from '@fortawesome/free-regular-svg-icons';

import { routesConfig } from '~/config';
import images from '~/assets/images';
import styles from './Header.module.scss';
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import Modal from '~/components/Modal';
import { AuthContext } from '~/contexts/AuthContext';
import Search from '../Search';

const cx = classNames.bind(styles);

const ITEMS_WITHOUT_LOGIN = [
    {
        icon: faLightbulb,
        title: 'Trung tâm nhà sáng tạo LIVE',
    },
    {
        icon: faLanguage,
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
        icon: faCircleQuestion,
        title: 'Phản hồi và trợ giúp',
    },
    {
        icon: faKeyboard,
        title: 'Phím tắt trên bàn phím',
    },
    {
        icon: faMoon,
        title: 'Chế độ tối',
        hasSwitchButton: true,
    },
];

const [head, ...tail] = ITEMS_WITHOUT_LOGIN;

const ITEMS_WITH_LOGIN = [
    {
        icon: faUser,
        title: 'Xem hồ sơ',
    },
    {
        icon: faCoins,
        title: 'Nhận xu',
    },
    head,
    {
        icon: faGear,
        title: 'Cài đặt',
    },
    ...tail,
    {
        icon: faArrowRightFromBracket,
        title: 'Đăng xuất',
        hasTopLine: true,
        onClick() {
            localStorage.removeItem('access_token');
            window.location.reload();
        },
    },
];

function Header() {
    const [showModal, setShowModal] = useState(false);

    const { auth } = useContext(AuthContext);
    const { isAuthenticated, user } = auth;

    return (
        <header className={cx('wrapper')}>
            <div className={cx('logo-wrapper')}>
                <Link className={cx('logo-link')} to={routesConfig.home}>
                    <img src={images.logo} alt="logo" />
                </Link>
            </div>

            <Search />

            <div className={cx('action')}>
                {isAuthenticated ? (
                    <>
                        <Button className={cx('upload-button-custom')} leftIcon={faPlus} size="medium">
                            Tải lên
                        </Button>

                        <Tippy content="Tin nhắn" placement="bottom">
                            <div>
                                <Button leftIcon={faPaperPlane} />
                            </div>
                        </Tippy>

                        <Tippy content="Hộp thư" placement="bottom">
                            <div>
                                <Button leftIcon={faMessage} />
                            </div>
                        </Tippy>
                    </>
                ) : (
                    <Button borderPrimary bgPrimary onClick={() => setShowModal(true)}>
                        Đăng nhập
                    </Button>
                )}

                <Menu items={isAuthenticated ? ITEMS_WITH_LOGIN : ITEMS_WITHOUT_LOGIN}>
                    {isAuthenticated ? (
                        <div className={cx('avatar-wrapper')}>
                            <Avatar src={user.avatar} alt="avatar" size={36} />
                        </div>
                    ) : (
                        <FontAwesomeIcon className={cx('more-icon')} icon={faEllipsisVertical} />
                    )}
                </Menu>
                <Modal state={[showModal, setShowModal]} />
            </div>
        </header>
    );
}

export default Header;
