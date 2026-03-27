import { useState, useRef } from 'react';
import axios from 'axios';

const UserTable = ({ users, onUserUpdate }) => {

    const [addRoleUserId, setAddRoleUserId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [feedback, setFeedback] = useState({ type: null, message: '' })
    const roleSelectRef = useRef(null)

    const handleUpdateRole = (userId, roleName) => {
        setIsLoading(true)
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}?role=${roleName}`, {}, { withCredentials: true })
            .then((res) => {
                setFeedback({ type: 'success', message: res.data.message || 'Role updated' })
                if (onUserUpdate) onUserUpdate()
            }).catch((err) => {
                setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to update role' })
            }).finally(() => {
                setIsLoading(false)
                setAddRoleUserId(null)
                setTimeout(() => setFeedback({ type: null, message: '' }), 2500)
            })
    }

    return (
        <div>
            {feedback.message && (
                <div className={`alert alert-${feedback.type} border-0 rounded-3 py-2 small m-3`}>{feedback.message}</div>
            )}

            <div className="table-responsive p-4">
                <table className="table table-dark table-hover align-middle mb-0">
                    <thead>
                        <tr className="text-secondary small text-uppercase">
                            <th className="fw-semibold py-3">ID</th>
                            <th className="fw-semibold py-3">Name</th>
                            <th className="fw-semibold py-3">Email</th>
                            <th className="fw-semibold py-3">Roles</th>
                            <th className="fw-semibold py-3 text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-secondary py-5">
                                    <p className="mb-0 opacity-50">No users found</p>
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="text-secondary">#{user.id}</td>
                                    <td className="fw-medium">{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="d-flex flex-wrap gap-1 align-items-center">
                                            {user.roles?.map((role) => (
                                                <span key={role.id || role.name} className="badge bg-primary bg-opacity-75 rounded-pill fw-normal small">
                                                    {role.name}
                                                </span>
                                            ))}
                                            {addRoleUserId === user.id ? (
                                                <div className="d-flex gap-1 ms-1">
                                                    <select ref={roleSelectRef} className="form-select form-select-sm bg-black text-light border-0 rounded-3" disabled={isLoading}>
                                                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                                                        <option value="ROLE_USER">ROLE_USER</option>
                                                    </select>
                                                    <button className="btn btn-success btn-sm border-0 rounded-3" disabled={isLoading} onClick={() => handleUpdateRole(user.id, roleSelectRef.current.value)}>
                                                        {isLoading ? '...' : 'Add'}
                                                    </button>
                                                    <button className="btn btn-outline-light btn-sm border-0 rounded-3" disabled={isLoading} onClick={() => setAddRoleUserId(null)}>✕</button>
                                                </div>
                                            ) : (
                                                <button className="btn btn-outline-light btn-sm border-0 rounded-3 opacity-50" onClick={() => setAddRoleUserId(user.id)}>+ Role</button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        <span className="text-secondary opacity-25">—</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
