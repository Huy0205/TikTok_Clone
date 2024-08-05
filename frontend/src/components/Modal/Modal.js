import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

import styles from './Modal.module.scss';
import Button from '../Button/Button';
import { UserServices } from '~/services';
import { AuthContext } from '~/contexts/AuthContext';
import Input from './Input';

const cx = classNames.bind(styles);

const currentYear = new Date().getFullYear();

function Modal({ state }) {
    const [showModal, setShowModal] = state;
    const [screen, setScreen] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [tiktokId, setTiktokId] = useState('');
    const [birthDate, setBirthDate] = useState({
        day: '',
        month: '',
        year: '',
    });
    const [days, setDays] = useState([...Array(31).keys()]);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [selectAtived, setSelectAtived] = useState();
    const [loading, setLoading] = useState(false);

    const { setAuth } = useContext(AuthContext);

    const classes = cx('container', {
        showModal,
    });

    useEffect(() => {
        const { month, year } = birthDate;
        if (month) {
            const dayInMonth = new Date(year || currentYear, month, 0).getDate();
            setDays([...Array(dayInMonth).keys()]);
        }
    }, [birthDate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
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
        setEmail('');
        setPassword('');
        setOtp('');
        setTiktokId('');
        setBirthDate({
            day: '',
            month: '',
            year: '',
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        changeForm('login');
    };

    const handleResendOtp = async () => {
        setLoading(true);
        const res = await UserServices.sendOTPByMail(email);
        if (res?.status === 200) {
            setLoading(false);
            setTimer(60);
        } else if (res?.status === 400) {
            alert('Email đa đươc đăng ký trước đó');
        } else if (res?.status === 500) {
            alert('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    const handleVerifyOtp = async () => {
        const res = await UserServices.verifyOTP(email, otp);
        if (res?.status === 200) {
            changeForm('inputTiktokId');
        } else if (res?.status === 400) {
            alert('Mã OTP không đúng');
        } else if (res?.status === 404) {
            alert('Mã OTP đã hết hạn');
        } else if (res?.status === 500) {
            alert('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    const handleRegister = async () => {
        const response = await UserServices.register(email, password, tiktokId, birthDate);
        if (response?.status === 200) {
            changeForm('login');
        } else if (response?.status === 400) {
            alert('TiKtok ID đã tồn tại');
        } else if (response?.status === 500) {
            alert('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    };

    const handleLogin = async () => {
        const response = await UserServices.login(email, password);
        if (response?.data) {
            const { token, user } = response.data;
            localStorage.setItem('access_token', token);
            setAuth({
                isAuthenticated: true,
                user: user,
            });
            setShowModal(false);
        } else if (response?.status === 400) {
            alert('Mật khẩu không đúng');
        } else if (response?.status === 404) {
            alert('Email không tồn tại');
        } else if (response?.status === 500) {
            alert('Có lỗi xảy ra, vui lòng thử lại sau');
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
                                                    value={birthDate.month}
                                                    onClick={() => handelSelectClick('month')}
                                                    onChange={(e) =>
                                                        setBirthDate({ ...birthDate, month: e.target.value })
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
                                                    value={birthDate.day}
                                                    onClick={() => handelSelectClick('day')}
                                                    onChange={(e) =>
                                                        setBirthDate({ ...birthDate, day: e.target.value })
                                                    }
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
                                                    value={birthDate.year}
                                                    onClick={() => handelSelectClick('year')}
                                                    onChange={(e) =>
                                                        setBirthDate({ ...birthDate, year: e.target.value })
                                                    }
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
                                        <label className={cx('note-text')}>
                                            Ngày sinh của bạn sẽ không được hiển thị công khai.
                                        </label>
                                    </div>
                                    <div className={cx('input-wrapper')}>
                                        <label className={cx('label')}>Email</label>
                                        <Input
                                            type={'email'}
                                            placeholder={'Địa chỉ email'}
                                            passState={[email, setEmail]}
                                        />
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Mật khẩu"
                                            button={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
                                            passState={[password, setPassword]}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                        <Input
                                            type="number"
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
                                            buttonDisable={!email || loading || timer > 0}
                                            passState={[otp, setOtp]}
                                            onClick={handleResendOtp}
                                        />
                                    </div>
                                    <Button
                                        size="large"
                                        bgPrimary
                                        disable={!email || !password || !otp}
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
                                        <Input type={'email'} placeholder={'Email'} passState={[email, setEmail]} />
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Mật khẩu"
                                            button={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
                                            passState={[password, setPassword]}
                                            onClick={() => setShowPassword(!showPassword)}
                                        />
                                        <div className={cx('forgot-password')}>Quên mật khẩu?</div>
                                    </div>
                                    <Button
                                        size="large"
                                        bgPrimary
                                        disable={!email || !password}
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
                                            passState={[tiktokId, setTiktokId]}
                                        />
                                    </div>
                                    <Button
                                        size="large"
                                        bgPrimary
                                        disable={!tiktokId}
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
