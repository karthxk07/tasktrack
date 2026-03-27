import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const hasUser = localStorage.getItem('user');

    if (hasUser) {
        return <Navigate to="/tasks" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
