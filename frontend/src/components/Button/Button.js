import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const Button = forwardRef(
    (
        {
            children,
            leftIcon,
            leftIconActive,
            size = 'medium',
            rightIcon,
            href,
            to,
            borderPrimary = false,
            noneStyleButton = false,
            buttonIcon = false,
            bgPrimary = false,
            bgSecondary = false,
            bgWhite = false,
            rounded = false,
            disable = false,
            hasSwitchButton = false,
            canActive = false,
            className,
            onClick,
            ...props
        },
        ref,
    ) => {
        const [darkThemes, setDarkThemes] = useState(false);
        let Component = 'button';

        if (href) {
            props.href = href;
            Component = 'a';
        } else if (canActive) {
            props.to = to;
            Component = NavLink;
        } else if (to) {
            props.to = to;
            Component = Link;
        } else if (hasSwitchButton) {
            Component = 'div';
        }

        const classes = cx(
            'wrapper',
            size,
            {
                borderPrimary,
                bgPrimary,
                bgSecondary,
                bgWhite,
                disable,
                noneStyleButton,
                buttonIcon,
                rounded,
            },
            className,
        );

        const handleActive = (nav) => cx(classes, { active: nav?.isActive });

        const toggleThemes = () => {
            setDarkThemes(!darkThemes);
        };

        return (
            <Component ref={ref} className={canActive ? handleActive : classes} onClick={onClick} {...props}>
                {leftIcon && <span className={cx('left-icon')}>{leftIcon}</span>}
                {leftIconActive && <span className={cx('left-icon-active')}>{leftIconActive}</span>}
                {children}
                {rightIcon && <span className={cx('rightIcon')}>{rightIcon}</span>}
                {hasSwitchButton && (
                    <div className={cx('switch-button-wrapper')}>
                        <button className={cx('switch-button')} onClick={toggleThemes}>
                            <FontAwesomeIcon icon={darkThemes ? faToggleOn : faToggleOff} />
                        </button>
                    </div>
                )}
            </Component>
        );
    },
);

Button.propTypes = {
    children: PropTypes.node.isRequired,
    leftIcon: PropTypes.node,
    leftIconActive: PropTypes.node,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    rightIcon: PropTypes.node,
    href: PropTypes.string,
    to: PropTypes.string,
    borderPrimary: PropTypes.bool,
    noneStyleButton: PropTypes.bool,
    buttonIcon: PropTypes.bool,
    bgPrimary: PropTypes.bool,
    bgSecondary: PropTypes.bool,
    bgWhite: PropTypes.bool,
    rounded: PropTypes.bool,
    disable: PropTypes.bool,
    hasSwitchButton: PropTypes.bool,
    canActive: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
