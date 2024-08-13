import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

function Input({
    type,
    placeholder,
    value,
    button,
    borderButtonLeft = false,
    buttonDisable = false,
    onBlur,
    onFocus,
    onChange,
    onClick,
    className,
}) {
    const classes = cx('button-right', { borderButtonLeft, buttonDisable });
    return (
        <div className={cx('input-item', className)}>
            <input
                type={type}
                className={cx('textfile')}
                placeholder={placeholder}
                value={value}
                onFocus={onFocus}
                onChange={onChange}
                onBlur={onBlur}
            />
            {button && (
                <button className={classes} onClick={onClick}>
                    {button}
                </button>
            )}
        </div>
    );
}

Input.propTypes = {
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    button: PropTypes.node,
    borderButtonLeft: PropTypes.bool,
    buttonDisable: PropTypes.bool,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
};

export default Input;
