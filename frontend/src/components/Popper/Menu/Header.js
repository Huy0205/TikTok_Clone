import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function Header({ title, onBack }) {
    return (
        <header className={cx('header-wrapper')}>
            <button className={cx('back-button')} onClick={onBack}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className={cx('header-title')}>{title}</span>
        </header>
    );
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
};

export default Header;
