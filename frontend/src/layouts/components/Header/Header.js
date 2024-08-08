import { useContext, useRef } from 'react';
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

import styles from './Header.module.scss';
import config from '~/config';
import images from '~/assets/images';
import Image from '~/components/Avatar';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import { AuthContext } from '~/contexts/AuthContext';
import Search from '../Search/Search';
import { ModalContext } from '~/contexts';

const cx = classNames.bind(styles);

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
            localStorage.removeItem('access_token');
            window.location.reload();
        },
    },
];

function Header() {
    const { openModal } = useContext(ModalContext);
    const { auth } = useContext(AuthContext);
    const { isAuthenticated, user } = auth;

    const headerRef = useRef();

    const handleClickLogin = () => {
        openModal();
    };

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
                            size="medium"
                        >
                            Tải lên
                        </Button>

                        <Tippy content="Tin nhắn" placement="bottom">
                            <Button buttonIcon>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </Button>
                        </Tippy>

                        <Tippy content="Hộp thư" placement="bottom">
                            <Button buttonIcon>
                                <FontAwesomeIcon icon={faMessage} />
                            </Button>
                        </Tippy>
                    </>
                ) : (
                    <Button borderPrimary bgPrimary onClick={handleClickLogin}>
                        Đăng nhập
                    </Button>
                )}

                <Menu items={isAuthenticated ? ITEMS_WITH_LOGIN : ITEMS_WITHOUT_LOGIN}>
                    {isAuthenticated ? (
                        <Image src={user.avatar} alt="avatar" size={36} />
                    ) : (
                        <FontAwesomeIcon className={cx('more-icon')} icon={faEllipsisVertical} />
                    )}
                </Menu>
            </div>
        </header>
    );
}

export default Header;
