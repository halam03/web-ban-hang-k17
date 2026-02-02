import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthDrawer = ({ open, mode, onClose, onModeChange }) => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
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

    const isLogin = mode === 'login';
    const panelTitle = isLogin ? 'Dang nhap' : 'Dang ky';

    useEffect(() => {
        if (!open) {
            setError('');
            setSubmitting(false);
        }
    }, [open]);

    useEffect(() => {
        setError('');
    }, [mode]);

    useEffect(() => {
        if (!open) return undefined;
        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            document.body.classList.add('auth-drawer-open');
        } else {
            document.body.classList.remove('auth-drawer-open');
        }
        return () => document.body.classList.remove('auth-drawer-open');
    }, [open]);

    const switchModeText = isLogin ? 'Chua co tai khoan? Dang ky' : 'Da co tai khoan? Dang nhap';

    const handleLoginChange = (event) => {
        setLoginForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleRegisterChange = (event) => {
        setRegisterForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const user = await login(loginForm);
            if (user?.loai_user === 0) {
                navigate('/admin');
            } else {
                navigate('/');
            }
            onClose();
        } catch (err) {
            setError('Dang nhap that bai');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (registerForm.password !== registerForm.confirmPassword) {
            setError('Mat khau xac nhan khong khop');
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
            onClose();
            navigate('/');
        } catch (err) {
            setError('Dang ky that bai');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`auth-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
            <div className="auth-drawer__backdrop" onClick={onClose}></div>
            <div className="auth-drawer__panel" role="dialog" aria-modal="true">
                <div className="auth-drawer__hero">
                    <div className="auth-drawer__badge">Camera Shop</div>
                    <h4 className="auth-drawer__hero-title">Chao mung ban quay lai</h4>
                    <p className="auth-drawer__hero-text">
                        Dang nhap de quan ly don hang, uu dai thanh vien va cac thong tin ca nhan.
                    </p>
                    <button type="button" className="auth-drawer__close" onClick={onClose} aria-label="Close">
                        x
                    </button>
                </div>

                <div className="auth-drawer__card">
                    <div className="auth-drawer__header">
                        <div>
                            <div className="auth-drawer__eyebrow">Tai khoan</div>
                            <h4 className="auth-drawer__title">{panelTitle}</h4>
                        </div>
                    </div>

                    <div className="auth-drawer__tabs">
                        <button
                            type="button"
                            className={`auth-drawer__tab${isLogin ? ' is-active' : ''}`}
                            onClick={() => onModeChange('login')}
                        >
                            Dang nhap
                        </button>
                        <button
                            type="button"
                            className={`auth-drawer__tab${!isLogin ? ' is-active' : ''}`}
                            onClick={() => onModeChange('register')}
                        >
                            Dang ky
                        </button>
                    </div>

                    {isLogin ? (
                        <form onSubmit={handleLoginSubmit} className="auth-drawer__form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="username"
                                    value={loginForm.username}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mat khau</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleLoginChange}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                                {submitting ? 'Dang nhap...' : 'Dang nhap'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="auth-drawer__form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    className="form-control"
                                    type="email"
                                    name="username"
                                    value={registerForm.username}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Ho va ten</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="ten_khach_hang"
                                    value={registerForm.ten_khach_hang}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>So dien thoai</label>
                                <input
                                    className="form-control"
                                    type="tel"
                                    name="so_dien_thoai"
                                    value={registerForm.so_dien_thoai}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Ngay sinh (tuy chon)</label>
                                <input
                                    className="form-control"
                                    type="date"
                                    name="ngay_sinh"
                                    value={registerForm.ngay_sinh}
                                    onChange={handleRegisterChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Dia chi</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="dia_chi"
                                    value={registerForm.dia_chi}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Mat khau</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    value={registerForm.password}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Xac nhan mat khau</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    name="confirmPassword"
                                    value={registerForm.confirmPassword}
                                    onChange={handleRegisterChange}
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
                                {submitting ? 'Dang ky...' : 'Dang ky'}
                            </button>
                        </form>
                    )}

                    <button
                        type="button"
                        className="btn btn-link auth-drawer__switch"
                        onClick={() => onModeChange(isLogin ? 'register' : 'login')}
                    >
                        {switchModeText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthDrawer;
