import { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      setSuccess('Login successful!');
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      setTimeout(() => { window.location.href = '/tasks'; }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-black">
      <div className="container">
        <div className="row align-items-center justify-content-center g-5">

          <div className="col-lg-5 col-md-6 text-center text-md-start">
            <h1 className="display-4 fw-bold text-light mb-3">
              <span className="text-primary">⬡</span> TaskTrack
            </h1>
            <p className="text-secondary fs-5 mb-4">
              Organize, assign, and track tasks with your team — all in one place.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
              <span className="badge bg-dark text-secondary border border-secondary border-opacity-25 rounded-pill px-3 py-2 fw-normal">Real-time tracking</span>
              <span className="badge bg-dark text-secondary border border-secondary border-opacity-25 rounded-pill px-3 py-2 fw-normal">Role-based access</span>
              <span className="badge bg-dark text-secondary border border-secondary border-opacity-25 rounded-pill px-3 py-2 fw-normal">Team management</span>
            </div>
          </div>

          <div className="col-lg-4 col-md-5">
            <form onSubmit={handleSubmit}>
              <div className="card bg-dark border-0 rounded-4 shadow-lg p-4">
                <h5 className="fw-bold text-light mb-1">Sign in</h5>
                <p className="text-secondary small mb-4">Enter your credentials to continue</p>

                {error && <div className="alert alert-danger border-0 rounded-3 py-2 small">{error}</div>}
                {success && <div className="alert alert-success border-0 rounded-3 py-2 small">{success}</div>}

                <div className="form-floating mb-3">
                  <input id="email" name="email" type="email" autoComplete="email" required
                    value={formData.email} onChange={handleChange}
                    className="form-control bg-black text-light border-0 rounded-3" placeholder="Email" />
                  <label htmlFor="email" className="text-secondary">Email address</label>
                </div>

                <div className="form-floating mb-4">
                  <input id="password" name="password" type="password" autoComplete="current-password" required
                    value={formData.password} onChange={handleChange}
                    className="form-control bg-black text-light border-0 rounded-3" placeholder="Password" />
                  <label htmlFor="password" className="text-secondary">Password</label>
                </div>

                <button type="submit" disabled={isLoading} className="btn btn-light w-100 rounded-3 fw-semibold">
                  {isLoading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm"></span> Signing in...
                    </span>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;
