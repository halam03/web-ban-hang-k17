import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = ({ initialTab }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const defaultTab = useMemo(() => {
        if (initialTab) return initialTab;
        if (location.pathname.includes('register')) return 'register';
        return 'login';
    }, [initialTab, location.pathname]);

    const [tab, setTab] = useState(defaultTab);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        ten_khach_hang: '',
        so_dien_thoai: '',
        dia_chi: '',
        ngay_sinh: '',
    });
    useEffect(() => {
        setTab(defaultTab);
    }, [defaultTab]);

    useEffect(() => {
        setError('');
        setSuccess('');
        setSubmitting(false);
    }, [tab]);

    const handleTabChange = (nextTab) => {
        setTab(nextTab);
        if (nextTab === 'register') {
            navigate('/register', { replace: true });
        } else if (nextTab === 'login') {
            navigate('/login', { replace: true });
        }
    };

    const handleLoginChange = (event) => {
        setLoginForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleRegisterChange = (event) => {
        setRegisterForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);
        try {
            const user = await login(loginForm);
            if (user?.loai_user === 0) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        if (registerForm.password !== registerForm.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                username: registerForm.username,
                password: registerForm.password,
                ten_khach_hang: registerForm.ten_khach_hang,
                so_dien_thoai: registerForm.so_dien_thoai,
                dia_chi: registerForm.dia_chi,
                ngay_sinh: registerForm.ngay_sinh || null,
            };
            await register(payload);
            navigate('/');
        } catch (err) {
            setError('Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-side">
                <div className="auth-brand">Camera Shop</div>
                <h2 className="auth-side__title">Xin chào!</h2>
                <p className="auth-side__text">
                    Quản lý đơn hàng, thông tin cá nhân và ưu đãi thành viên trong một nơi duy nhất.
                </p>
                <div className="auth-side__stats">
                    <div>
                        <span className="auth-side__value">24/7</span>
                        <span className="auth-side__label">Hỗ trợ</span>
                    </div>
                    <div>
                        <span className="auth-side__value">100%</span>
                        <span className="auth-side__label">Bảo mật</span>
                    </div>
                </div>
            </div>

            <div className="auth-panel">
                <div className="auth-card">
                    <div className="auth-card__head">
                        <div>
                            <div className="auth-card__eyebrow">Tài khoản</div>
                            <h3 className="auth-card__title">{tab === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h3>
                        </div>
                        <div className="auth-tabs">
                            <button
                                type="button"
                                className={`auth-tab${tab === 'login' ? ' is-active' : ''}`}
                                onClick={() => handleTabChange('login')}
                            >
                                Đăng nhập
                            </button>
                            <button
                                type="button"
                                className={`auth-tab${tab === 'register' ? ' is-active' : ''}`}
                                onClick={() => handleTabChange('register')}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>

                    {tab === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="auth-form">
                            <div className="auth-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="username"
                                    value={loginForm.username}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            <div className="auth-field">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            <div className="auth-row">
                                <button className="auth-primary" type="submit" disabled={submitting}>
                                    {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                </button>
                                <button className="auth-link" type="button" onClick={() => handleTabChange('register')}>
                                    Tạo tài khoản
                                </button>
                            </div>
                        </form>
                    )}

                    {tab === 'register' && (
                        <form onSubmit={handleRegisterSubmit} className="auth-form">
                            <div className="auth-grid">
                                <div className="auth-field">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="username"
                                        value={registerForm.username}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>Họ và tên</label>
                                    <input
                                        type="text"
                                        name="ten_khach_hang"
                                        value={registerForm.ten_khach_hang}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="so_dien_thoai"
                                        value={registerForm.so_dien_thoai}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>Ngày sinh</label>
                                    <input
                                        type="date"
                                        name="ngay_sinh"
                                        value={registerForm.ngay_sinh}
                                        onChange={handleRegisterChange}
                                    />
                                </div>
                                <div className="auth-field auth-field--full">
                                    <label>Địa chỉ</label>
                                    <input
                                        type="text"
                                        name="dia_chi"
                                        value={registerForm.dia_chi}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={registerForm.password}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                                <div className="auth-field">
                                    <label>Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={registerForm.confirmPassword}
                                        onChange={handleRegisterChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button className="auth-primary" type="submit" disabled={submitting}>
                                {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
                            </button>
                        </form>
                    )}

                    {(error || success) && (
                        <div className={`auth-message ${error ? 'is-error' : 'is-success'}`}>{error || success}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
