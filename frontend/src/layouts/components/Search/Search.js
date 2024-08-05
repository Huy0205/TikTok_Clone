import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';
import { KeywordServices, UserServices } from '~/services';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Button from '~/components/Button';
import { AuthContext } from '~/contexts/AuthContext';
import KeywordSearchResult from './SearchResult/keywords';
import { AccountSearchResult } from './SearchResult';

const cx = classNames.bind(styles);

function Search() {
    const [keyword, setKeyword] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clickOutside, setClickOutside] = useState(false);

    const debouncedValue = useDebounce(keyword, 500);

    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if (debouncedValue.trim()) {
            setLoading(true);
            const fetchSearchResult = async () => {
                try {
                    const [keywordsRes, accountsRes] = await Promise.all([
                        KeywordServices.search(debouncedValue),
                        UserServices.search(auth.user.tiktokId, debouncedValue, 1, 5),
                    ]);

                    if (keywordsRes?.data) {
                        setKeywords(keywordsRes.data);
                    } else {
                        throw new Error('Lỗi server khi tìm kiếm từ khóa');
                    }

                    if (accountsRes?.data) {
                        setAccounts(accountsRes.data);
                    } else {
                        throw new Error('Lỗi server khi tìm kiếm tài khoản');
                    }
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                } finally {
                    setLoading(false);
                }

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setKeyword(e.target.value);
        }
    };

    return (
        // Using a wrapper <div> tag around the reference element
        // solves this by creating a new parentNode context.
        <div>
            <HeadlessTippy
                interactive
                visible={(accounts.length > 0 || keywords.length > 0) && !clickOutside}
                render={(attrs) => (
                    <div className={cx('search-result-wrapper')} tabIndex="-1" {...attrs}>
                        <PopperWrapper className={cx('search-result')}>
                            <KeywordSearchResult keywords={keywords} />
                            {accounts.length > 0 && <span className={cx('search-title')}>Tài khoản</span>}
                            <AccountSearchResult accounts={accounts} />
                            {keyword && (
                                <Button noneStyleButton className={cx('show-all-result')}>
                                    Xem tất cả kết quả cho "{keyword}"
                                </Button>
                            )}
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={() => setClickOutside(true)}
            >
                <div className={cx('search-box')}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        spellCheck={false}
                        value={keyword}
                        onFocus={() => setClickOutside(false)}
                        onChange={handleChange}
                    />
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
        </div>
    );
}

export default Search;
