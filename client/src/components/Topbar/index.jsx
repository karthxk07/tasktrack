import axios from "axios";
import config from "../../config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const Topbar = () => {

    const [user, setUser] = useState({ email: '', role: '' })
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${config.API_BASE_URL}/auth/me`, { withCredentials: true })
            .then((res) => setUser({ email: res.data.email, role: res.data.role }))
            .catch(() => { })
    }, [])

    const handleLogout = () => {
        axios.get(`${config.API_BASE_URL}/auth/logout`, { withCredentials: true })
            .then(() => navigate('/login'))
            .catch(() => { })
    }

    return (
        <nav className="navbar navbar-expand-lg bg-black border-bottom border-secondary border-opacity-25">
            <div className="container">
                <Link to="/tasks" className="navbar-brand text-light fw-bold">
                    <span className="text-primary">⬡</span> TaskTrack
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to="/tasks" className="nav-link text-light opacity-75">Tasks</Link>
                        </li>
                        {user.role === 'ROLE_ADMIN' && (
                            <li className="nav-item">
                                <Link to="/users" className="nav-link text-light opacity-75">Users</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <button className="nav-link dropdown-toggle text-light opacity-75 btn btn-link text-decoration-none" type="button" data-bs-toggle="dropdown">
                                {user.email || '...'}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark border-secondary p-0 rounded-3">
                                <li><button className="dropdown-item text-danger py-2" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Topbar;