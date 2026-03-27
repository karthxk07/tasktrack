import { useState } from 'react';
import axios from 'axios';
import config from '../../config';

const UserSearch = ({ onSearchResults, onClear }) => {

    const [searchType, setSearchType] = useState('email')
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchTerm.trim()) { if (onClear) onClear(); return }

        setIsLoading(true)
        setError('')

        const request = searchType === 'id'
            ? axios.get(`${config.API_BASE_URL}/api/users/${searchTerm}`, { withCredentials: true }).then((res) => onSearchResults([res.data]))
            : axios.get(`${config.API_BASE_URL}/api/users/email?email=${encodeURIComponent(searchTerm)}`, { withCredentials: true }).then((res) => onSearchResults(Array.isArray(res.data) ? res.data : [res.data]))

        request.catch((err) => { setError(err.response?.data?.message || 'Search failed'); onSearchResults([]) })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="card bg-dark border-0 rounded-4 p-3">
            <form onSubmit={handleSearch} className="row g-3 align-items-end">
                <div className="col-md-3">
                    <label htmlFor="search-type" className="form-label small text-secondary mb-1">Search By</label>
                    <select id="search-type" value={searchType} onChange={(e) => { setSearchType(e.target.value); setSearchTerm(''); setError('') }}
                        className="form-select bg-black text-light border-0 rounded-3">
                        <option value="email">Email</option>
                        <option value="id">ID</option>
                    </select>
                </div>
                <div className="col-md-5">
                    <label htmlFor="search-term" className="form-label small text-secondary mb-1">{searchType === 'id' ? 'User ID' : 'Email'}</label>
                    <input id="search-term" type={searchType === 'id' ? 'number' : 'text'} value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setError('') }}
                        placeholder={`Enter ${searchType}...`}
                        className="form-control bg-black text-light border-0 rounded-3" />
                </div>
                <div className="col-md-4 d-flex gap-2">
                    <button type="submit" disabled={isLoading} className="btn btn-light rounded-3 fw-semibold w-100">
                        {isLoading ? '...' : 'Search'}
                    </button>
                    <button type="button" onClick={() => { setSearchTerm(''); setError(''); if (onClear) onClear() }} className="btn btn-outline-light border-0 rounded-3 w-100">
                        Clear
                    </button>
                </div>
            </form>
            {error && <div className="alert alert-danger border-0 rounded-3 py-2 small mt-3 mb-0">{error}</div>}
        </div>
    );
};

export default UserSearch;
