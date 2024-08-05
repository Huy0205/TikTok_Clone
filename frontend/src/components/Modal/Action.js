import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import Button from '../Button';

const cx = classNames.bind(styles);

function Action({ children, disable, onClick }) {
    return (
        <Button size="large" bgPrimary disable={disable} className={cx('more-style-login-button')} onClick={onClick}>
            {children}
        </Button>
    );
}

export default Action;
