import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';
import { KeywordServices, UserServices } from '~/services';
import AccountItem from '~/components/AccountItem';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import { AuthContext } from '~/contexts/AuthContext';

const cx = classNames.bind(styles);

function Search() {
    const [keyword, setKeyword] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const debouncedValue = useDebounce(keyword, 800);

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        console.log('debouncedValue', debouncedValue);
        if (debouncedValue.trim()) {
            setLoading(true);
            const fetchSearchResult = async () => {
                const accountsRes = await UserServices.search(auth.user.tiktokId, debouncedValue, 1, 5);
                if (accountsRes?.data) {
                    setAccounts(accountsRes.data);
                } else if (accountsRes?.status === 500) {
                    alert('Server error');
                }

                const keywordsRes = await KeywordServices.search(debouncedValue);
                if (keywordsRes?.data) {
                    setKeywords(keywordsRes.data);
                } else if (keywordsRes?.status === 500) {
                    alert('Server error');
                }

                setLoading(false);

                const increaseKeywordCountRes = await KeywordServices.inscreaseKeywordCount(debouncedValue);
                if (increaseKeywordCountRes?.status === 200) {
                    console.log('Increase keyword count successfully');
                } else if (increaseKeywordCountRes?.status === 500) {
                    console.log('Server error');
                }
            };
            fetchSearchResult();
        } else {
            setKeywords([]);
            setAccounts([]);
        }
    }, [debouncedValue]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setKeyword(e.target.value);
        }
    };

    return (
        <HeadlessTippy
            interactive
            visible={accounts.length > 0 || keywords.length > 0}
            render={(attrs) => (
                <div className={cx('search-result-wrapper')} tabIndex="-1" {...attrs}>
                    <PopperWrapper className={cx('search-result')}>
                        {keywords.map((keyword) => (
                            <Button noneStyleButton key={keyword._id} className={cx('keyword-item')}>
                                <FontAwesomeIcon className={cx('icon-search-keyword')} icon={faMagnifyingGlass} />
                                <span className={cx('keyword-content')}>{keyword.content}</span>
                            </Button>
                        ))}
                        {accounts.length > 0 && <span className={cx('search-title')}>Tài khoản</span>}
                        {accounts.map((account) => (
                            <Button
                                key={account.id}
                                noneStyleButton
                                className={cx('account-item')}
                                to={`/@${account.nickname}`}
                            >
                                <AccountItem account={account} />
                            </Button>
                        ))}
                        {keyword && (
                            <Button noneStyleButton className={cx('show-all-result')}>
                                Xem tất cả kết quả cho "{keyword}"
                            </Button>
                        )}
                    </PopperWrapper>
                </div>
            )}
        >
            <div className={cx('search-box')}>
                <input type="text" placeholder="Tìm kiếm" spellCheck={false} value={keyword} onChange={handleChange} />
                {loading && <FontAwesomeIcon className={cx('loading')} icon={faCircleNotch} />}
                {keyword && !loading && (
                    <button className={cx('clear-btn')} onClick={() => setKeyword('')}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                <button className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </HeadlessTippy>
    );
}

export default Search;
