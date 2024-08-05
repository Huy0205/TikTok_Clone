import { useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Button({
    children,
    leftIcon,
    size = 'medium',
    rightIcon,
    href,
    to,
    borderPrimary = false,
    noneStyleButton = false,
    bgPrimary = false,
    disable = false,
    hasSwitchButton = false,
    className,
    onClick,
    ...props
}) {
    const [darkThems, setDarkThemes] = useState(false);
    let Component = 'button';

    if (href) {
        props.href = href;
        Component = 'a';
    } else if (to) {
        props.to = to;
        Component = Link;
    } else if (hasSwitchButton) {
        Component = 'div';
    }

    const classes = cx(className, 'wrapper', size, {
        borderPrimary,
        bgPrimary,
        disable,
        noneStyleButton,
        noneChildren: !children,
    });

    const toggleThemes = () => {
        setDarkThemes(!darkThems);
    };

    return (
        <Component className={classes} onClick={onClick} {...props}>
            {leftIcon && <FontAwesomeIcon className={cx('leftIcon')} icon={leftIcon} />}
            {children}
            {rightIcon && <FontAwesomeIcon icon={rightIcon} />}
            {hasSwitchButton === true && (
                <div className={cx('switch-button-wrapper')}>
                    <button className={cx('switch-button')} onClick={toggleThemes}>
                        <FontAwesomeIcon icon={darkThems ? faToggleOn : faToggleOff} />
                    </button>
                </div>
            )}
        </Component>
    );
}

export default Button;
