import { useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';

import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import Item from './Item';
import Header from './Header';

const cx = classNames.bind(styles);

function Menu({ children, items }) {
    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1];

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            const onClick = () => {
                if (isParent) {
                    setHistory((prev) => [...prev, item.children]);
                }
            };

            const classes = cx({ 'high-level-custom': history.length > 1, 'has-top-line': item.hasTopLine });

            return <Item className={classes} key={index} item={item} onClick={item.onClick || onClick} />;
        });
    };

    return (
        <Tippy
            interactive
            hideOnClick={false}
            delay={[0, 700]}
            render={(attrs) => (
                <div className={cx('content')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        {history.length > 1 && (
                            <Header
                                title={current.title}
                                onBack={() => {
                                    setHistory((prev) => prev.slice(0, prev.length - 1));
                                }}
                            />
                        )}
                        {renderItems()}
                    </PopperWrapper>
                </div>
            )}
            onHide={() => setHistory([{ data: items }])}
        >
            {children}
        </Tippy>
    );
}

export default Menu;
