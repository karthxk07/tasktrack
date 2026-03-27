import TaskTableRow from "../TaskTableRow";

const TaskTable = ({ tasks, setErrorSuccess, onTaskChange }) => {

    return (
        <div className="table-responsive p-4">
            <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                    <tr className="text-secondary small text-uppercase">
                        <th className="fw-semibold py-3">Title</th>
                        <th className="fw-semibold py-3">Description</th>
                        <th className="fw-semibold py-3">Status</th>
                        <th className="fw-semibold py-3">Assignee</th>
                        <th className="fw-semibold py-3">Created By</th>
                        <th className="fw-semibold py-3 text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-secondary py-5">
                                <div className="py-3">
                                    <p className="mb-1 fs-5 opacity-50">No tasks found</p>
                                    <small className="opacity-25">Create a new task or adjust your filters</small>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <TaskTableRow key={task.id} task={task} setErrorSuccess={setErrorSuccess} onTaskChange={onTaskChange} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;