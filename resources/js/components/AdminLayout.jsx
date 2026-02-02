import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tab = searchParams.get('tab') || 'analyze';

    const linkClass = (name) =>
        tab === name ? 'admin-nav__link is-active' : 'admin-nav__link';

    const titleMap = {
        analyze: 'Thống kê',
        products: 'Sản phẩm',
        categories: 'Danh mục',
        orders: 'Đơn hàng',
        users: 'Người dùng',
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            <aside className="admin-nav">
                <div className="admin-brand">
                    <span className="admin-brand__logo">CS</span>
                    <div className="admin-brand__title">
                        <span className="admin-brand__title-dark">Camera</span>
                        <span className="admin-brand__title-light">Shop</span>
                    </div>
                </div>
                <nav className="admin-nav__menu">
                    <Link className={linkClass('analyze')} to="/admin?tab=analyze">Thống kê</Link>
                    <Link className={linkClass('products')} to="/admin?tab=products">Sản phẩm</Link>
                    <Link className={linkClass('categories')} to="/admin?tab=categories">Danh mục</Link>
                    <Link className={linkClass('orders')} to="/admin?tab=orders">Đơn hàng</Link>
                    <Link className={linkClass('users')} to="/admin?tab=users">Người dùng</Link>
                    <button className="admin-nav__link admin-nav__link--ghost" type="button" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </nav>
                <div className="admin-nav__footer">
                    <div className="admin-user-card">
                        <div className="admin-user-card__avatar">{user?.username?.[0]?.toUpperCase()}</div>
                        <div>
                            <div className="admin-user-card__name">{user?.username}</div>
                            <div className="admin-user-card__role">Quản trị</div>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="admin-main">
                <header className="admin-main__header">
                    <div>
                        <h1 className="admin-main__title">{titleMap[tab] || 'Bảng quản trị'}</h1>
                        <p className="admin-main__subtitle">Chào mừng, {user?.username}</p>
                    </div>
                </header>
                <div className="admin-main__content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;


