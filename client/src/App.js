import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UsersListPage from './pages/UsersListPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import TaskListPage from './pages/TaskListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<UsersListPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
