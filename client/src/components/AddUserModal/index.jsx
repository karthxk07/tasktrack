import { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const AddUserModal = ({ onUserAdded }) => {

    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [errorSuccess, setErrorSuccess] = useState({ error: null, message: '' })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
        setErrorSuccess({ error: null, message: '' })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorSuccess({ error: null, message: '' })

        const { password } = formData;
        if (password.length < 6 || !(/[A-Z]/.test(password)) || !(/[!@#$%^&*(),.?":{}|<>]/.test(password))) {
            setErrorSuccess({ error: true, message: 'Password must be at least 6 characters, contain 1 uppercase letter and 1 special character' })
            setIsLoading(false)
            return;
        }

        axios.post(`${config.API_BASE_URL}/auth/register`, formData, { withCredentials: true })
            .then(() => {
                setErrorSuccess({ error: false, message: 'User registered' })
                setFormData({ name: '', email: '', password: '' })
                if (onUserAdded) onUserAdded()
            }).catch((err) => {
                setErrorSuccess({ error: true, message: err.response?.data?.message || 'Registration failed' })
            }).finally(() => setIsLoading(false))
    }

    return (
        <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pb-0 px-4 pt-4">
                        <h5 className="modal-title fw-bold" id="addUserModalLabel">Register User</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body px-4 pb-4">
                            {errorSuccess.error === true && <div className="alert alert-danger border-0 rounded-3 py-2 small">{errorSuccess.message}</div>}
                            {errorSuccess.error === false && <div className="alert alert-success border-0 rounded-3 py-2 small">{errorSuccess.message}</div>}

                            <div className="form-floating mb-3">
                                <input type="text" className="form-control bg-black text-light border-0 rounded-3" id="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                                <label htmlFor="name" className="text-secondary">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control bg-black text-light border-0 rounded-3" id="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                                <label htmlFor="email" className="text-secondary">Email</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input type="password" className="form-control bg-black text-light border-0 rounded-3" id="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                <label htmlFor="password" className="text-secondary">Password</label>
                            </div>
                            <button type="submit" className="btn btn-light w-100 rounded-3 fw-semibold" disabled={isLoading}>
                                {isLoading ? 'Registering...' : 'Register User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
