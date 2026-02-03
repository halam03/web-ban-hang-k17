import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { notifyError, notifySuccess } from '../utils/notify';

const Header = () => {
    const { user, logout } = useAuth();
    const { items } = useCart();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) {
            params.set('search', query.trim());
        }
        navigate(`/shop?${params.toString()}`);
    };

    const handleLogout = async () => {
        try {
            await logout();
            notifySuccess('Đăng xuất thành công.');
            navigate('/');
        } catch (err) {
            notifyError('Không thể đăng xuất. Vui lòng thử lại.');
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row bg-secondary py-1 px-xl-5">
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="d-inline-flex align-items-center h-100">
                            <span className="text-body mr-3">Camera Shop</span>
                            <span className="text-body mr-3">Liên hệ</span>
                            <span className="text-body mr-3">Hỗ trợ</span>
                            <span className="text-body mr-3">Hỏi đáp</span>
                        </div>
                    </div>
                    <div className="col-lg-6 text-center text-lg-right">
                        <div className="d-inline-flex align-items-center">
                            {user?.loai_user === 0 && (
                                <Link className="btn btn-sm btn-outline-secondary mr-2 text-dark" to="/admin">
                                    Bảng quản trị
                                </Link>
                            )}
                            <div className="btn-group">
                                {user ? (
                                    <>
                                        <button type="button" className="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">
                                            {user.username}
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right">
                                            {user?.loai_user === 0 && (
                                                <Link className="dropdown-item" to="/admin">
                                                    Quản trị
                                                </Link>
                                            )}
                                            <button className="dropdown-item" type="button" onClick={handleLogout}>
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link className="btn btn-sm btn-light" to="/login">Đăng nhập</Link>
                                        <Link className="btn btn-sm btn-light ml-2" to="/register">Đăng ký</Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="d-inline-flex align-items-center d-block d-lg-none">
                            <Link to="/cart" className="btn px-0 ml-2">
                                <i className="fas fa-shopping-cart text-dark"></i>
                                <span className="badge text-dark border border-dark rounded-circle" style={{ paddingBottom: 2 }}>{items.length}</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
                    <div className="col-lg-4">
                        <Link to="/" className="text-decoration-none">
                            <span className="h1 text-uppercase text-primary bg-dark px-2">Camera</span>
                            <span className="h1 text-uppercase text-dark bg-primary px-2 ml-n1">Shop</span>
                        </Link>
                    </div>
                    <div className="col-lg-4 col-6 text-left">
                        <form onSubmit={handleSearch}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm sản phẩm"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button className="input-group-text bg-transparent text-primary" type="submit">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-4 col-6 text-right">
                        <p className="m-0">Chương trình chăm sóc</p>
                        <h5 className="m-0">+012 345 6789</h5>
                    </div>
                </div>
            </div>

            <div className="container-fluid bg-dark mb-30">
                <div className="row px-xl-5">
                    <div className="col-lg-3 d-none d-lg-block">
                        <span className="btn d-flex align-items-center justify-content-between bg-primary w-100" style={{ height: 65, padding: '0 30px' }}>
                            <h6 className="text-dark m-0"><i className="fa fa-bars mr-2"></i>Danh mục</h6>
                            <i className="fa fa-angle-down text-dark"></i>
                        </span>
                    </div>
                    <div className="col-lg-9">
                        <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                            <Link to="/" className="text-decoration-none d-block d-lg-none">
                                <span className="h1 text-uppercase text-dark bg-light px-2">Camera</span>
                                <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">Shop</span>
                            </Link>
                            <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                                <div className="navbar-nav mr-auto py-0">
                                    <Link className="nav-item nav-link" to="/">Trang chủ</Link>
                                    <Link className="nav-item nav-link" to="/shop">Sản phẩm</Link>
                                    <Link className="nav-item nav-link" to="/cart">Giỏ hàng</Link>
                                    <Link className="nav-item nav-link" to="/checkout">Thanh toán</Link>
                                </div>
                                <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
                                    <Link to="/cart" className="btn px-0 ml-3">
                                        <i className="fas fa-shopping-cart text-primary"></i>
                                        <span className="badge text-secondary border border-secondary rounded-circle" style={{ paddingBottom: 2 }}>{items.length}</span>
                                    </Link>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
