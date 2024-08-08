import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './VideoItem.module.scss';
import Avatar from '~/components/Avatar';
import { BookmarkIcon, CommentIcon, HeartIcon, ShareIcon } from '~/components/Icon';

const cx = classNames.bind(styles);

function VideoSibar() {
    return (
        <div className={cx('sibar')}>
            <Link to={'/'} className={cx('btn')}>
                <Avatar
                    src="https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/2230b7161a0f08eb041b38bc42238bbf.jpeg?lk3s=a5d48078&nonce=41733&refresh_token=7b7efc11219586152769a1f638876149&x-expires=1723194000&x-signature=kQCPGB4adI7aXx20GxobEDJ5%2F2k%3D&shp=a5d48078&shcp=b59d6b55"
                    alt="avatar"
                    size={48}
                    className={cx('avatar')}
                />
            </Link>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <HeartIcon />
                </span>
                <strong>1433</strong>
            </button>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <CommentIcon />
                </span>
                <strong>1433</strong>
            </button>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <BookmarkIcon />
                </span>
                <strong>1433</strong>
            </button>
            <button className={cx('btn')}>
                <span className={cx('icon-btn-wrapper')}>
                    <ShareIcon />
                </span>
                <strong>1433</strong>
            </button>
        </div>
    );
}

export default VideoSibar;
