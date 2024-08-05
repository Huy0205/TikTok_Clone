import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Avatar from '../Avatar';

const cx = classNames.bind(styles);

function AccountItem({ account }) {
    const { avatar, tiktokId, nickname } = account;

    return (
        <div className={cx('wrapper')}>
            <Avatar className={cx('avatar-custom')} src={avatar} alt={nickname} size={40} />
            <div className={cx('info')}>
                <h4 className={cx('tiktokId')}>{tiktokId}</h4>
                <span className={cx('nickname')}>{nickname}</span>
            </div>
        </div>
    );
}

export default AccountItem;
