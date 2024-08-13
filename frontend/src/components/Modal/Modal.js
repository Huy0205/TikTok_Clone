import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

import styles from './Modal.module.scss';
import Button from '../Button/Button';
import { UserServices } from '~/services';
import { AuthContext } from '~/contexts/AuthContext';
import Input from './Input';
import { ModalContext } from '~/contexts';

const cx = classNames.bind(styles);

const currentYear = new Date().getFullYear();

function Modal() {
    const { showModal, closeModal } = useContext(ModalContext);
    const [screen, setScreen] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [days, setDays] = useState([...Array(31).keys()]);
    const [otpValue, setOtpValue] = useState('');
    const [formData, setFormData] = useState({});
    const [timer, setTimer] = useState(0);
    const [selectAtived, setSelectAtived] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    const { setAuth } = useContext(AuthContext);

    const classes = cx('container', {
        showModal,
    });

    useEffect(() => {
        if (formData.birthdate) {
            const { day, month, year } = formData.birthdate;
            if (month) {
                const dayInMonth = new Date(year || currentYear, month, 0).getDate();
                setDays([...Array(dayInMonth).keys()]);

                setError((prevError) => {
                    if (day > dayInMonth) {
                        return { ...prevError, birthdate: 'Vui lòng chọn ngày sinh hợp lệ!' };
                    } else {
                        return { ...prevError, birthdate: '' };
                    }
                });
            }
        }
    }, [formData.birthdate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handelSelectClick = (nameSelect) => {
        if (selectAtived === nameSelect) {
            setSelectAtived(undefined);
        } else {
            setSelectAtived(nameSelect);
        }
    };

    const changeForm = (form) => {
        setScreen(form);
        if (form === 'inputTiktokId') {
            return;
        }
        setFormData({});
        setError({});
    };

    const handleChangeData = (field, value) => {
        if (field.includes('.')) {
            const [mainField, subField] = field.split('.');
            setFormData({
                ...formData,
                [mainField]: {
                    ...formData[mainField],
                    [subField]: value,
                },
            });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const validData = (field, value) => {
        let newError = { ...error };

        if (field === 'email') {
            const { email } = formData;
            const check = value || email;
            if (!check) {
                newError.email = 'Vui lòng nhập email';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(check)) {
                newError.email = 'Email không hợp lệ';
            } else {
                newError.email = '';
            }
        } else if (field === 'password') {
            const { password } = formData;
            const check = value || password;
            const lengthError = check.length < 8 || check.length > 20;
            const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=[\]/`~';]).*$/;
            const characterError = !regex.test(check);

            newError.password = {
                length: lengthError,
                character: characterError,
            };
        } else if (field === 'otp') {
            if (!otpValue) {
                newError.otp = 'Vui lòng nhập mã OTP';
            } else if (otpValue.length !== 6) {
                newError.otp = 'Nhập mã gồm 6 chữ số';
            } else if (!/^\d+$/.test(otpValue)) {
                newError.otp = 'Mã OTP chỉ chứa số';
            } else {
                newError.otp = '';
            }
        } else if (field === 'tiktokId') {
            const { tiktokId } = formData;
            if (!tiktokId) {
                newError.tiktokId = 'Vui lòng nhập TikTok ID';
            } else {
                const regex = /^(?=.{6,24}$)(?!.*\.\.)(?!^\.)(?!.*\.$)[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*$/;
                if (!regex.test(tiktokId)) {
                    newError.tiktokId =
                        'TikTok ID chỉ bao gồm chữ cái, số, dấu chấm và dấu gạch dưới; dấu chấm không được đứng đầu hoặc cuối, không được có 2 dấu chấm liên tiếp và phải dài từ 6 đến 24 ký tự';
                } else {
                    newError.tiktokId = '';
                }
            }
        }
        setError(newError);
    };

    const handleCheckPassword = (e) => {
        const value = e.target.value;
        handleChangeData('password', value);
        validData('password', value);
    };

    const handleCloseModal = () => {
        closeModal();
        changeForm('login');
    };

    const handleSendOtp = async () => {
        if (error.email) {
            return;
        }
        setLoading(true);
        const response = await UserServices.sendOTPByMail(formData.email);
        if (response.code === 'EMAIL_ALREADY_EXISTS') {
            setError({ ...error, email: 'Email này đã được liên kết với một tài khoản khác!' });
        } else if (response.code === 'OTP_SENT_SUCCESSFULLY') {
            setTimer(60);
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau!');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (formData.birthdate) {
            const { day, month, year } = formData.birthdate;
            if (!day || !month || !year) {
                setError({ ...error, birthdate: 'Chưa chọn đủ ngày sinh!' });
                return;
            }
        } else {
            setError({ ...error, birthdate: 'Vui lòng chọn ngày sinh!' });
            return;
        }
        const { birthdate, password, otp } = error;
        if (birthdate || password.lengthError || password.characterError || otp) {
            return;
        }

        const response = await UserServices.verifyOTP(formData.email, otpValue);
        if (response.code === 'OTP_IS_CORRECT') {
            changeForm('inputTiktokId');
        } else if (response.code === 'OTP_IS_EXPIRED') {
            setError({ ...error, otp: 'Mã OTP đã hết hạn, vui lòng gửi lại mã mới!' });
        } else if (response.code === 'OTP_IS_INCORRECT') {
            setError({ ...error, otp: 'Mã OTP không chính xác!' });
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau!');
        }
    };

    const handleRegister = async () => {
        console.log(formData);
        if (error.tiktokId) {
            return;
        }
        const response = await UserServices.register(formData);
        if (response.code === 'TIKTOKID_IS_EXIST') {
            setError({ ...error, tiktokId: 'TikTok ID này đã tồn tại!' });
        } else if (response.code === 'REGISTER_SUCCESSFULLY') {
            alert('Đăng ký thành công!');
            changeForm('login');
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau!');
        }
    };

    const handleLogin = async () => {
        const response = await UserServices.login(formData);
        if (response.code === 'EMAIL_NOT_EXIST') {
            setError({ ...error, email: 'Email không tồn tại!' });
        } else if (response.code === 'PASSWORD_INCORRECT') {
            setError({ ...error, password: 'Mật khẩu không đúng!' });
        } else if (response.code === 'LOGIN_SUCCESSFULLY') {
            const { token, user } = response.data;
            localStorage.setItem('access_token', token);
            setAuth({
                isAuthenticated: true,
                user: user,
            });
            closeModal();
            window.location.reload();
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại sau!');
            window.location.reload();
        }
    };

    return (
        <div className={classes}>
            <div className={cx('wrapper')}>
                <div className={cx('modal-top')}>
                    <button className={cx('close-button')} onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className={cx('modal-center')}>
                    <div className={cx('modal-content')}>
                        <div className={cx('modal-header')}>
                            <h2>{screen === 'register' || screen === 'inputTiktokId' ? 'Đăng ký' : 'Đăng nhập'}</h2>
                        </div>
                        <div className={cx('modal-body')}>
                            {screen === 'register' && (
                                <>
                                    <div className={cx('input-wrapper')}>
                                        <label className={cx('label')}>Ngày sinh của bạn là ngày nào?</label>
                                        <div className={cx('select-container')}>
                                            <div className={cx('select-wrapper')}>
                                                <select
                                                    className={cx('select', {
                                                        active: selectAtived === 'month',
                                                    })}
                                                    name="month"
                                                    id="month"
                                                    value={formData.birthdate?.month}
                                                    onClick={() => handelSelectClick('month')}
                                                    onChange={(e) =>
                                                        handleChangeData('birthdate.month', e.target.value)
                                                    }
                                                >
                                                    <option value="">Tháng</option>
                                                    {[...Array(12).keys()].map((month) => (
                                                        <option key={month} value={month + 1}>
                                                            {`Tháng ${month + 1}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={cx('select-wrapper')}>
                                                <select
                                                    className={cx('select', {
                                                        active: selectAtived === 'day',
                                                    })}
                                                    name="day"
                                                    id="day"
                                                    value={formData.birthdate?.day}
                                                    onClick={() => handelSelectClick('day')}
                                                    onChange={(e) => handleChangeData('birthdate.day', e.target.value)}
                                                >
                                                    <option value="">Ngày</option>
                                                    {days.map((day) => (
                                                        <option key={day} value={day + 1}>
                                                            {day + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={cx('select-wrapper')}>
                                                <select
                                                    className={cx('select', {
                                                        active: selectAtived === 'year',
                                                    })}
                                                    name="year"
                                                    id="year"
                                                    value={formData.birthdate?.year}
                                                    onClick={() => handelSelectClick('year')}
                                                    onChange={(e) => handleChangeData('birthdate.year', e.target.value)}
                                                >
                                                    <option value="">Năm</option>
                                                    {[...Array(100).keys()].map((year) => (
                                                        <option key={year} value={currentYear - year}>
                                                            {currentYear - year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {error.birthdate ? (
                                            <span className={cx('error')}>{error.birthdate}</span>
                                        ) : (
                                            <label className={cx('note-text')}>
                                                Ngày sinh của bạn sẽ không được hiển thị công khai.
                                            </label>
                                        )}
                                    </div>
                                    <div className={cx('input-wrapper')}>
                                        <label className={cx('label')}>Email</label>
                                        <Input
                                            type={'email'}
                                            placeholder={'Địa chỉ email'}
                                            value={formData.email}
                                            onBlur={() => validData('email')}
                                            onFocus={() => setError({ ...error, email: '' })}
                                            onChange={(e) => handleChangeData('email', e.target.value)}
                                        />
                                        {error.email && <span className={cx('error')}>{error.email}</span>}
                                        <Input
                                            className={cx('password-register')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Mật khẩu"
                                            value={formData.password}
                                            button={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
                                            onChange={handleCheckPassword}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                        <div className={cx('check-password-register')}>
                                            <label>Mật khẩu của bạn phải gồm:</label>
                                            <span
                                                className={cx(
                                                    error.password ? (error.password.length ? 'error' : 'valid') : '',
                                                )}
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        error.password
                                                            ? error.password.length
                                                                ? faXmark
                                                                : faCheck
                                                            : faCheck
                                                    }
                                                />
                                                8 đến 20 ký tự
                                            </span>
                                            <span
                                                className={cx(
                                                    error.password
                                                        ? error.password.character
                                                            ? 'error'
                                                            : 'valid'
                                                        : '',
                                                )}
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        error.password
                                                            ? error.password.length
                                                                ? faXmark
                                                                : faCheck
                                                            : faCheck
                                                    }
                                                />
                                                Các chữ cái, số và ký tự đặc biệt
                                            </span>
                                        </div>
                                        <Input
                                            type="text"
                                            placeholder="Nhập mã gồm 6 chữ số"
                                            button={
                                                loading ? (
                                                    <FontAwesomeIcon
                                                        className={cx('loading')}
                                                        icon={faCircleNotch}
                                                        color="rgba(22, 24, 35, 0.5)"
                                                    />
                                                ) : timer > 0 ? (
                                                    `${timer}s`
                                                ) : (
                                                    'Gửi mã'
                                                )
                                            }
                                            borderButtonLeft
                                            buttonDisable={!formData.email || loading || timer > 0}
                                            value={otpValue}
                                            onBlur={() => validData('otp')}
                                            onFocus={() => setError({ ...error, otp: '' })}
                                            onChange={(e) => setOtpValue(e.target.value)}
                                            onClick={handleSendOtp}
                                        />
                                        {error.otp && <span className={cx('error')}>{error.otp}</span>}
                                    </div>
                                    <Button
                                        size="large"
                                        bgPrimary
                                        disable={!formData.email || !formData.password || !otpValue}
                                        className={cx('more-style-login-button')}
                                        onClick={handleVerifyOtp}
                                    >
                                        Tiếp
                                    </Button>
                                </>
                            )}

                            {screen === 'login' && (
                                <>
                                    <div className={cx('input-wrapper')}>
                                        <Input
                                            type={'email'}
                                            placeholder={'Email'}
                                            value={formData.email}
                                            onChange={(e) => handleChangeData('email', e.target.value)}
                                        />
                                        {error.email && <span className={cx('error')}>{error.email}</span>}
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Mật khẩu"
                                            value={formData.password}
                                            button={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
                                            onChange={(e) => handleChangeData('password', e.target.value)}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                        {error.password && <span className={cx('error')}>{error.password}</span>}
                                        <div className={cx('forgot-password')}>Quên mật khẩu?</div>
                                    </div>
                                    <Button
                                        size="large"
                                        bgPrimary
                                        disable={!formData.email || !formData.password}
                                        className={cx('more-style-login-button')}
                                        onClick={handleLogin}
                                    >
                                        Đăng nhập
                                    </Button>
                                </>
                            )}

                            {screen === 'inputTiktokId' && (
                                <>
                                    <div className={cx('input-wrapper')}>
                                        <label className={cx('label')}>Tạo TikTok ID</label>
                                        <Input
                                            type={'text'}
                                            placeholder={'TikTok ID'}
                                            value={formData.tiktokId}
                                            onBlur={() => validData('tiktokId')}
                                            onChange={(e) => handleChangeData('tiktokId', e.target.value)}
                                        />
                                        {error.tiktokId && <span className={cx('error')}>{error.tiktokId}</span>}
                                    </div>
                                    <Button
                                        size="large"
                                        bgPrimary
                                        disable={!formData.tiktokId}
                                        className={cx('more-style-login-button')}
                                        onClick={handleRegister}
                                    >
                                        Đăng ký
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className={cx('modal-bottom')}>
                    Bạn {screen === 'register' || screen === 'inputTiktokId' ? 'đã' : 'không'} có tài khoản?{' '}
                    <Button
                        noneStyleButton
                        className={cx('change-form')}
                        onClick={() =>
                            changeForm(screen === 'register' || screen === 'inputTiktokId' ? 'login' : 'register')
                        }
                    >
                        Đăng {screen === 'register' || screen === 'inputTiktokId' ? 'nhập' : 'ký'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
