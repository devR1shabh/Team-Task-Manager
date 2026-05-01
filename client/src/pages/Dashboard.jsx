import { useEffect, useState } from "react";
import Message from "../components/Message.jsx";
import api, { getApiError } from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboard(response.data.data);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <section>
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <Message error={error} />

      {dashboard && (
        <>
          <div className="stats-grid">
            <div className="stat">
              <span>Total tasks</span>
              <strong>{dashboard.totalTasks}</strong>
            </div>
            {Object.entries(dashboard.tasksByStatus || {}).map(
              ([status, count]) => (
                <div className="stat" key={status}>
                  <span>{status}</span>
                  <strong>{count}</strong>
                </div>
              )
            )}
          </div>

          <div className="grid-two">
            <div className="panel">
              <h3>Tasks per user</h3>
              {dashboard.tasksPerUser?.length ? (
                <ul className="list">
                  {dashboard.tasksPerUser.map((item) => (
                    <li key={item.userId}>
                      <span>
                        {item.name} ({item.email})
                      </span>
                      <strong>{item.count}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No task assignments yet.</p>
              )}
            </div>

            <div className="panel">
              <h3>Overdue tasks</h3>
              {dashboard.overdueTasks?.length ? (
                <ul className="list vertical">
                  {dashboard.overdueTasks.map((task) => (
                    <li key={task._id}>
                      <strong>{task.title}</strong>
                      <span>
                        {task.assignedTo?.name} · Due{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No overdue tasks.</p>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Dashboard;
