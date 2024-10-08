import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import Avatar from '../Avatar';

const cx = classNames.bind(styles);

function AccountItem({ account, className }) {
    const { avatar, tiktokId, nickname } = account;

    return (
        <div className={cx('wrapper', className)}>
            <Avatar className={cx('avatar-custom')} src={avatar} alt={nickname} size={40} />
            <div className={cx('info-container')}>
                <div className={cx('info')}>
                    <h4 className={cx('tiktokId')}>{tiktokId + 'sagdgdwdqygdywqg'}</h4>
                    <span className={cx('nickname')}>{nickname}</span>
                </div>
            </div>
        </div>
    );
}

AccountItem.propTypes = {
    account: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default AccountItem;
