import axios from "axios";
import { useState } from "react";

const TaskTableRow = ({ task: initialTask, setErrorSuccess, onTaskChange }) => {

    const [editEnabled, setEditEnabled] = useState(false)
    const [task, setTask] = useState(initialTask)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const showFeedback = (error, message) => {
        setErrorSuccess({ error, message })
        setTimeout(() => setErrorSuccess({ error: null, message: '' }), 2500)
    }

    const handleTaskUpdate = (taskData) => {
        axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${taskData.id}`, taskData, { withCredentials: true })
            .then(() => showFeedback(false, 'Task updated'))
            .catch((err) => showFeedback(true, err.response?.data?.error || 'Update failed'))
    }

    const handleDelete = () => {
        setShowDeleteModal(false)
        axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${task.id}`, { withCredentials: true })
            .then(() => { showFeedback(false, 'Task deleted'); if (onTaskChange) onTaskChange() })
            .catch((err) => showFeedback(true, err.response?.data?.error || 'Delete failed'))
    }

    const statusBadge = (status) => {
        const map = { 'DONE': 'bg-success', 'IN_PROGRESS': 'bg-warning text-dark', 'TODO': 'bg-light text-dark' }
        return map[status] || 'bg-secondary'
    }

    return (
        <>
            <tr>
                <td className="fw-medium">{editEnabled
                    ? <input type="text" className="form-control form-control-sm bg-black text-light border-0 rounded-3" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
                    : task.title}
                </td>
                <td className="text-secondary small">{editEnabled
                    ? <input type="text" className="form-control form-control-sm bg-black text-light border-0 rounded-3" value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} />
                    : task.description}
                </td>
                <td>{editEnabled ? (
                    <select className="form-select form-select-sm bg-black text-light border-0 rounded-3" value={task.status} onChange={(e) => setTask({ ...task, status: e.target.value })}>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>
                ) : (
                    <span className={`badge rounded-pill ${statusBadge(task.status)}`}>{task.status}</span>
                )}</td>
                <td className="small">
                    {editEnabled
                        ? <input type="number" className="form-control form-control-sm bg-black text-light border-0 rounded-3" value={task.assignedTo?.id || ''} onChange={(e) => setTask({ ...task, assignedTo: { id: e.target.value } })} />
                        : <>{(task.assignedTo?.name) || '—'} {task.assignedTo && <span className="text-secondary">#{task.assignedTo.id}</span>}</>
                    }
                </td>
                <td className="small">
                    {(task.createdBy?.name) || '—'} {task.createdBy && <span className="text-secondary">#{task.createdBy.id}</span>}
                </td>
                <td className="text-end">
                    <div className="btn-group btn-group-sm">
                        {!editEnabled ? (
                            <button className="btn btn-outline-light border-0 rounded-3" onClick={() => setEditEnabled(true)}>Edit</button>
                        ) : (
                            <button className="btn btn-success border-0 rounded-3" onClick={() => { setEditEnabled(false); handleTaskUpdate(task) }}>Save</button>
                        )}
                        <button className="btn btn-outline-danger border-0 rounded-3" onClick={() => setShowDeleteModal(true)}>Delete</button>
                    </div>
                </td>
            </tr>

            {showDeleteModal && (
                <>
                    <tr className="d-none"><td></td></tr>
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" onClick={() => setShowDeleteModal(false)}>
                        <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75"></div>
                        <div className="position-relative" onClick={(e) => e.stopPropagation()}>
                            <div className="card bg-dark border-0 rounded-4 shadow-lg p-4" >
                                <div className="text-center">
                                    <div className="text-danger mb-3 fs-1">⚠</div>
                                    <h6 className="fw-bold text-light mb-2">Delete Task?</h6>
                                    <p className="text-secondary small mb-4">
                                        Are you sure you want to delete <strong className="text-light">"{task.title}"</strong>? This cannot be undone.
                                    </p>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button className="btn btn-outline-light border-0 rounded-3 px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                        <button className="btn btn-danger rounded-3 px-4" onClick={handleDelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default TaskTableRow;