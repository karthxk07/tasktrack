const TaskFilter = ({ filter, setFilter }) => {

    const handleChange = (e) => {
        setFilter({ ...filter, [e.target.id]: e.target.value })
    }

    return (
        <form className="row g-3 align-items-end">
            <div className="col-md-4">
                <label htmlFor="createdById" className="form-label small text-secondary mb-1">Created By (ID)</label>
                <input type="text" className="form-control bg-black text-light border-0 rounded-3" id="createdById" placeholder="User ID" onChange={handleChange} />
            </div>
            <div className="col-md-4">
                <label htmlFor="assigneeId" className="form-label small text-secondary mb-1">Assignee (ID)</label>
                <input type="text" className="form-control bg-black text-light border-0 rounded-3" id="assigneeId" placeholder="User ID" onChange={handleChange} />
            </div>
            <div className="col-md-4">
                <label htmlFor="status" className="form-label small text-secondary mb-1">Status</label>
                <select className="form-select bg-black text-light border-0 rounded-3" id="status" onChange={handleChange}>
                    <option value="">All</option>
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                </select>
            </div>
        </form>
    );
};

export default TaskFilter;