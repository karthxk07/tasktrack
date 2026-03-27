import { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../../components/Topbar";
import UserTable from "../../components/UserTable";
import UserSearch from "../../components/UserSearch";
import AddUserModal from "../../components/AddUserModal";

const UsersListPage = () => {

    const [users, setUsers] = useState([])
    const [displayUsers, setDisplayUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchUsers = () => {
        setIsLoading(true)
        setError('')
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`, { withCredentials: true })
            .then((res) => { setUsers(res.data); setDisplayUsers(res.data) })
            .catch((err) => setError(err.response?.data?.message || 'Failed to fetch users'))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => { fetchUsers() }, [])

    return (
        <div className="bg-black text-light min-vh-100">
            <Topbar />
            <AddUserModal onUserAdded={fetchUsers} />

            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-0">Users</h2>
                        <small className="text-secondary">Manage accounts and roles</small>
                    </div>
                    <button type="button" className="btn btn-light rounded-3 fw-semibold" data-bs-toggle="modal" data-bs-target="#addUserModal">
                        + Add User
                    </button>
                </div>

                {error && <div className="alert alert-danger border-0 rounded-3 py-2 small">{error}</div>}

                <div className="mb-4">
                    <UserSearch
                        onSearchResults={(results) => setDisplayUsers(results)}
                        onClear={() => setDisplayUsers(users)}
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-light spinner-border-sm"></div>
                        <p className="text-secondary small mt-2">Loading users...</p>
                    </div>
                ) : (
                    <div className="card bg-dark border-0 rounded-4 overflow-hidden">
                        <UserTable users={displayUsers} onUserUpdate={fetchUsers} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersListPage;