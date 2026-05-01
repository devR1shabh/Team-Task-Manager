import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Team Task Manager</h1>
          <p>
            {user?.name} ({user?.role}) · ID: {user?._id}
          </p>
        </div>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <nav className="nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
