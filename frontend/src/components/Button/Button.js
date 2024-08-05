import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
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
            size = 'medium',
            rightIcon,
            href,
            to,
            borderPrimary = false,
            noneStyleButton = false,
            buttonIcon = false,
            bgPrimary = false,
            disable = false,
            hasSwitchButton = false,
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
                disable,
                noneStyleButton,
                buttonIcon,
            },
            className,
        );

        const toggleThemes = () => {
            setDarkThemes(!darkThemes);
        };

        return (
            <Component ref={ref} className={classes} onClick={onClick} {...props}>
                {leftIcon && <FontAwesomeIcon className={cx('leftIcon')} icon={leftIcon} />}
                {children}
                {rightIcon && <FontAwesomeIcon icon={rightIcon} />}
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
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    rightIcon: PropTypes.node,
    href: PropTypes.string,
    to: PropTypes.string,
    borderPrimary: PropTypes.bool,
    noneStyleButton: PropTypes.bool,
    buttonIcon: PropTypes.bool,
    bgPrimary: PropTypes.bool,
    disable: PropTypes.bool,
    hasSwitchButton: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
