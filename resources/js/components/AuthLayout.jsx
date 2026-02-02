import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
    <div className="auth-page">
        <Outlet />
    </div>
);

export default AuthLayout;
