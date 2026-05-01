import { useEffect, useMemo, useState } from "react";
import Message from "../components/Message.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api, { getApiError } from "../services/api";

const statuses = ["To Do", "In Progress", "Done"];
const priorities = ["low", "medium", "high"];

const emptyTaskForm = {
  title: "",
  description: "",
  projectId: "",
  assignedTo: "",
  status: "To Do",
  priority: "medium",
  dueDate: ""
};

function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === taskForm.projectId),
    [projects, taskForm.projectId]
  );

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.data.tasks || []);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const response = await api.get("/projects");
      const nextProjects = response.data.data.projects || [];
      setProjects(nextProjects);
      if (nextProjects.length) {
        setTaskForm((current) => ({
          ...current,
          projectId: current.projectId || nextProjects[0]._id
        }));
      }
    } catch (err) {
      setError(getApiError(err));
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject?.members?.length && !taskForm.assignedTo) {
      setTaskForm((current) => ({
        ...current,
        assignedTo: selectedProject.members[0]._id
      }));
    }
  }, [selectedProject, taskForm.assignedTo]);

  const handleTaskChange = (event) => {
    const { name, value } = event.target;

    setTaskForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "projectId" ? { assignedTo: "" } : {})
    }));
  };

  const createTask = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/tasks", taskForm);
      setTaskForm((current) => ({
        ...emptyTaskForm,
        projectId: current.projectId
      }));
      setSuccess("Task created.");
      fetchTasks();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const updateStatus = async (taskId, status) => {
    setError("");
    setSuccess("");

    try {
      await api.put(`/tasks/${taskId}/status`, { status });
      setSuccess("Task status updated.");
      fetchTasks();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <section>
      <div className="page-header">
        <h2>Tasks</h2>
      </div>
      <Message error={error} success={success} />

      {isAdmin && (
        <form className="panel form-grid" onSubmit={createTask}>
          <h3>Create task</h3>
          <label>
            Title
            <input
              name="title"
              value={taskForm.title}
              onChange={handleTaskChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              rows="3"
            />
          </label>
          <label>
            Project
            <select
              name="projectId"
              value={taskForm.projectId}
              onChange={handleTaskChange}
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option value={project._id} key={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assign to
            <select
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleTaskChange}
              required
            >
              <option value="">Select member</option>
              {selectedProject?.members?.map((member) => (
                <option value={member._id} key={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              name="status"
              value={taskForm.status}
              onChange={handleTaskChange}
            >
              {statuses.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskChange}
            >
              {priorities.map((priority) => (
                <option value={priority} key={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
          <label>
            Due date
            <input
              name="dueDate"
              type="date"
              value={taskForm.dueDate}
              onChange={handleTaskChange}
              required
            />
          </label>
          <button type="submit">Create task</button>
        </form>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="stack">
          {tasks.map((task) => (
            <article className="panel" key={task._id}>
              <div className="item-header">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || "No description"}</p>
                </div>
                <small>{task.priority}</small>
              </div>

              <div className="task-meta">
                <span>Project: {task.projectId?.name || "Unknown"}</span>
                <span>Assigned: {task.assignedTo?.name || "Unknown"}</span>
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>

              <label className="status-control">
                Status
                <select
                  value={task.status}
                  onChange={(event) => updateStatus(task._id, event.target.value)}
                  disabled={task.assignedTo?._id !== user?._id}
                >
                  {statuses.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
          {!tasks.length && <p>No tasks found.</p>}
        </div>
      )}
    </section>
  );
}

export default Tasks;
