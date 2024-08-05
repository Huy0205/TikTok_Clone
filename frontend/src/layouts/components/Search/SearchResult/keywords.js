import classNames from 'classnames/bind';

import styles from './SearchResult.module.scss';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '~/components/Button';
import { memo } from 'react';

const cx = classNames.bind(styles);

function Keywords({ keywords }) {
    return (
        <div className={cx('wrapper-keywords')}>
            {keywords.map((keyword) => (
                <Button key={keyword._id} size="large" noneStyleButton className={cx('keyword-item')}>
                    <FontAwesomeIcon className={cx('icon-search-keyword')} icon={faMagnifyingGlass} />
                    <span className={cx('keyword-content')}>{keyword.content}</span>
                </Button>
            ))}
        </div>
    );
}

export default memo(Keywords);
