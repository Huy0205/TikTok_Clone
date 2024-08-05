import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';

import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
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

            return <MenuItem className={classes} key={index} item={item} onClick={item.onClick || onClick} />;
        });
    };

    const renderContent = (attrs) => (
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
                <div className={cx('menu-body')}>{renderItems()}</div>
            </PopperWrapper>
        </div>
    );

    // Reset the menu to level 1 when the menu is closed
    const handleReset = () => setHistory([{ data: items }]);

    return (
        // Using a wrapper <div> tag around the reference element
        // solves this by creating a new parentNode context.
        <div className={cx('wrapper')}>
            <Tippy interactive hideOnClick={false} delay={[0, 700]} render={renderContent} onHide={handleReset}>
                {children}
            </Tippy>
        </div>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array.isRequired,
};

export default Menu;
