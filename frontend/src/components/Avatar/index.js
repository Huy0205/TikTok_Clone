import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar({ src, alt, size, className }) {
    return <img src={src} alt={alt} className={cx('avatar', className)} width={size} height={size} />;
}

export default Avatar;
