import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

function Input({
    type,
    placeholder,
    button,
    borderButtonLeft = false,
    buttonDisable = false,
    passState = [],
    onClick,
}) {
    const [inputState, setInputState] = passState;
    const classes = cx('button-right', { borderButtonLeft, buttonDisable });
    return (
        <div className={cx('input-item')}>
            <input
                type={type}
                className={cx('textfile')}
                placeholder={placeholder}
                value={inputState}
                onChange={(e) => setInputState(e.target.value)}
            />
            {button && (
                <button className={classes} onClick={onClick}>
                    {button}
                </button>
            )}
        </div>
    );
}

export default Input;
