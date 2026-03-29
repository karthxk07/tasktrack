import axios from "axios";
import config from "../../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import TaskFilter from "../../components/TaskFilter";
import TaskTable from "../../components/TaskTable";
import TaskFormModal from "../../components/TaskFormModal";
import Topbar from "../../components/Topbar";

const TaskListPage = () => {

  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState({ assigneeId: '', status: '', createdById: '' })
  const [errorSuccess, setErrorSuccess] = useState({ error: null, message: '' })
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/api/tasks?assignedTo=${filter.assigneeId}&status=${filter.status}&createdBy=${filter.createdById}`, { withCredentials: true })
      .then((res) => setTasks(res.data))
      .catch((err) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate('/login')
        }
        setErrorSuccess({ error: true, message: err.response?.data?.error || 'Failed to load tasks' })
        setTimeout(() => setErrorSuccess({ error: null, message: '' }), 3000)
      })
  }, [filter, navigate])

  const refreshTasks = () => setFilter({ ...filter })

  return (
    <div className="bg-black text-light min-vh-100">
      <Topbar />
      <TaskFormModal onTaskCreated={refreshTasks} />

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Tasks</h2>
            <small className="text-secondary">Manage and track your work with TaskTrack</small>
          </div>
          <button type="button" className="btn btn-light rounded-3 fw-semibold" data-bs-toggle="modal" data-bs-target="#createTaskModal">
            + New Task
          </button>
        </div>

        {errorSuccess.error === true && (
          <div className="alert alert-danger border-0 rounded-3 py-2 small">{errorSuccess.message}</div>
        )}
        {errorSuccess.error === false && (
          <div className="alert alert-success border-0 rounded-3 py-2 small">{errorSuccess.message}</div>
        )}

        <div className="card bg-dark border-0 rounded-4 p-3 mb-4">
          <TaskFilter filter={filter} setFilter={setFilter} />
        </div>

        <div className="card bg-dark border-0 rounded-4 overflow-hidden">
          <TaskTable tasks={tasks} setErrorSuccess={setErrorSuccess} onTaskChange={refreshTasks} />
        </div>
      </div>
    </div>
  );
};

export default TaskListPage;
