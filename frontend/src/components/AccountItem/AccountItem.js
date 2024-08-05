import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Image from '../Image/Image';

const cx = classNames.bind(styles);

function AccountItem({ account }) {
    const { avatar, tiktokId, nickname } = account;

    return (
        <div className={cx('wrapper')}>
            <Image className={cx('avatar-custom')} src={avatar} alt={nickname} size={40} />
            <div className={cx('info')}>
                <h4 className={cx('tiktokId')}>{tiktokId}</h4>
                <span className={cx('nickname')}>{nickname}</span>
            </div>
        </div>
    );
}

AccountItem.propTypes = {
    account: PropTypes.object.isRequired,
};

export default AccountItem;
