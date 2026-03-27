import { useState } from "react";
import axios from "axios";

const TaskFormModal = ({ onTaskCreated }) => {

    const [task, setTask] = useState({ title: '', description: '', assignedTo: { id: '' }, status: '' })
    const [errorSuccess, setErrorSuccess] = useState({ error: null, message: '' })

    const handleChange = (e) => {
        setTask({ ...task, [e.target.id]: e.target.value })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const payload = { ...task }
        if (payload.assignedTo.id === '') delete payload.assignedTo
        if (payload.status === '') delete payload.status

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`, payload, { withCredentials: true })
            .then(() => {
                setErrorSuccess({ error: false, message: 'Task created successfully' })
                if (onTaskCreated) onTaskCreated()
            }).catch((err) => {
                setErrorSuccess({ error: true, message: err.response?.data?.error || 'Failed to create task' })
            })
    }

    return (
        <div className="modal fade" id="createTaskModal" tabIndex="-1" aria-labelledby="createTaskModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pb-0 px-4 pt-4">
                        <h5 className="modal-title fw-bold" id="createTaskModalLabel">New Task</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body px-4 pb-4">
                        {errorSuccess.error === true && <div className="alert alert-danger border-0 rounded-3 py-2 small">{errorSuccess.message}</div>}
                        {errorSuccess.error === false && <div className="alert alert-success border-0 rounded-3 py-2 small">{errorSuccess.message}</div>}

                        <form onSubmit={onSubmit}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control bg-black text-light border-0 rounded-3" id="title" placeholder="Title" onChange={handleChange} />
                                <label htmlFor="title" className="text-secondary">Title</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control bg-black text-light border-0 rounded-3" id="description" placeholder="Description" onChange={handleChange} />
                                <label htmlFor="description" className="text-secondary">Description</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="number" className="form-control bg-black text-light border-0 rounded-3" id="assignedTo.id" placeholder="Assignee Id" onChange={(e) => {
                                    setTask({ ...task, assignedTo: { id: e.target.value } })
                                }} />
                                <label htmlFor="assignedTo.id" className="text-secondary">Assignee ID</label>
                            </div>
                            <div className="form-floating mb-4">
                                <select className="form-select bg-black text-light border-0 rounded-3" id="status" onChange={handleChange}>
                                    <option value="">Auto</option>
                                    <option value="TODO">TODO</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="DONE">DONE</option>
                                </select>
                                <label htmlFor="status" className="text-secondary">Status</label>
                            </div>
                            <input type="submit" className="btn btn-light w-100 rounded-3 fw-semibold" value="Create Task" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskFormModal;